"""Mappe di esempio interamente sintetiche per il sito (nessun dato reale).

Racconto in 5 passi, come nel flusso operativo del progetto:
  1. variabilità storica da satellite (serie di più anni, pixel 10 m)
  2. campionamento del suolo mirato, guidato dalle zone storiche
  3. monitoraggio satellitare durante la stagione (anomalie rispetto allo storico)
  4. volo del drone solo sulle aree da approfondire
  5. mappa di distribuzione dei biostimolanti a rateo variabile (risoluzione drone)

Paesaggio, appezzamenti e valori sono inventati.

Uso (dalla cartella del progetto):
    python scripts/synthetic_maps.py            # scrive public/mappe/*.webp
    python scripts/synthetic_maps.py <cartella> # scrive altrove
Richiede: numpy, scipy, matplotlib, pillow.
"""
import io
import re
import sys
from pathlib import Path as FsPath
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.path import Path
from matplotlib.colors import ListedColormap, LinearSegmentedColormap
from matplotlib.patches import PathPatch, Polygon, FancyBboxPatch
from scipy.ndimage import gaussian_filter, binary_opening, binary_dilation, zoom, distance_transform_edt

OUT = FsPath(sys.argv[1]) if len(sys.argv) > 1 else FsPath(__file__).resolve().parent.parent / "public" / "mappe"
OUT.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(11)

TEXT = "#2D3330"
GROUND = "#E9E5D9"
LEGEND_BAND = 0.17  # frazione inferiore della figura riservata a legenda/didascalia/colorbar (vedi new_map)
MUTED = "#C7C3B8"    # grigio neutro per le classi/elementi non isolati nelle varianti "isola" (vedi sotto)
plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 12, "text.color": TEXT})


def slug(label):
    # Nome file leggibile da un'etichetta di legenda (es. "Dose −25%" -> "dose-meno25").
    s = label.replace("−", "-").replace("+", "piu").replace("-", "meno")
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")

# ---------------------------------------------------------------- paesaggio (1 unità = 10 m)
W, H = 170, 128
F = 4                       # risoluzione drone: 10 m / 4 = 2.5 m
ANG = np.deg2rad(9)
col_w = rng.integers(22, 34, 9)
row_h = rng.integers(26, 40, 6)
us = np.r_[0, np.cumsum(col_w)] - 30
vs = np.r_[0, np.cumsum(row_h)] - 30
U, V = np.meshgrid(us, vs)
U = U + rng.uniform(-2.5, 2.5, U.shape)
V = V + rng.uniform(-2.5, 2.5, V.shape)
X = U * np.cos(ANG) - V * np.sin(ANG)
Y = U * np.sin(ANG) + V * np.cos(ANG)


def cell(i, j, gap=0.9):
    q = np.array([(X[i, j], Y[i, j]), (X[i, j + 1], Y[i, j + 1]),
                  (X[i + 1, j + 1], Y[i + 1, j + 1]), (X[i + 1, j], Y[i + 1, j])])
    c = q.mean(0)
    return c + (q - c) * (1 - gap / np.linalg.norm(q - c, axis=1, keepdims=True))


FARM = [(2, 3), (2, 4), (3, 3), (3, 4)]
ROAD_ROW, CANAL_COL = 4, 5
PARCELS = [cell(i, j) for i, j in FARM]
CLIP = Path.make_compound_path(*[Path(np.vstack([p, p[:1]]), closed=True) for p in PARCELS])


def masks(scale):
    h, w = H * scale, W * scale
    yy, xx = np.mgrid[0:h, 0:w]
    pts = (np.c_[xx.ravel(), yy.ravel()] + 0.5) / scale
    m = np.zeros((h, w), bool); inn = np.zeros((h, w), bool); per = []
    for p in PARCELS:
        P = Path(p)
        a = P.contains_points(pts, radius=2).reshape(h, w)
        b = P.contains_points(pts, radius=-2).reshape(h, w)
        core = P.contains_points(pts).reshape(h, w)
        m |= a | b
        inn |= core & ~(a ^ b)
        per.append(core)
    return m, inn, per


mask, inner, per_parcel = masks(1)
mask_f, inner_f, _ = masks(F)

BG_COLORS = ["#D8D1BA", "#CEC7A6", "#C2C8A4", "#B3BC95", "#DED7C2", "#C9BD9F", "#BBC29C"]
bg_fill = {(i, j): BG_COLORS[rng.integers(len(BG_COLORS))]
           for i in range(len(vs) - 1) for j in range(len(us) - 1)}


def landscape(ax):
    ax.add_patch(Polygon([(0, 0), (W, 0), (W, H), (0, H)], color=GROUND, zorder=0))
    for (i, j), c in bg_fill.items():
        if (i, j) not in FARM:
            ax.add_patch(Polygon(cell(i, j), closed=True, fc=c, ec="none", zorder=1))
    ax.plot(X[ROAD_ROW + 1], Y[ROAD_ROW + 1], color="white", lw=5, solid_capstyle="butt", zorder=2)
    ax.plot(X[ROAD_ROW + 1], Y[ROAD_ROW + 1], color="#B9B3A3", lw=0.6, zorder=2)
    ax.plot(X[:, CANAL_COL], Y[:, CANAL_COL], color="#8FB3C0", lw=2.4, zorder=2)


def outline(ax):
    for p in PARCELS:
        q = np.vstack([p, p[:1]])
        ax.plot(q[:, 0], q[:, 1], color="white", lw=3.2, zorder=6)
        ax.plot(q[:, 0], q[:, 1], color=TEXT, lw=1.1, zorder=7)


def show(ax, data, m, z=4, **kw):
    im = ax.imshow(np.ma.array(data, mask=~m), origin="lower", extent=(0, W, 0, H),
                   interpolation="nearest", zorder=z, **kw)
    im.set_clip_path(PathPatch(CLIP, transform=ax.transData))
    return im


fx = np.concatenate([p[:, 0] for p in PARCELS]); fy = np.concatenate([p[:, 1] for p in PARCELS])
cx, cy = (fx.min() + fx.max()) / 2, (fy.min() + fy.max()) / 2
half_w = (fx.max() - fx.min()) / 2 + 14
half_h = max(half_w * 0.75, (fy.max() - fy.min()) / 2 + 10)
half_w = half_h / 0.75
VIEW = (cx - half_w, cx + half_w, cy - half_h, cy + half_h)


def decorations(ax):
    x0, x1, y0, y1 = VIEW
    bx, by = x0 + 5, y0 + 5
    ax.add_patch(FancyBboxPatch((bx - 2, by - 2.2), 24, 7.5, boxstyle="round,pad=0,rounding_size=1.5",
                                fc="white", ec="none", alpha=0.92, zorder=9))
    ax.plot([bx, bx + 20], [by, by], color=TEXT, lw=2.4, zorder=10, solid_capstyle="butt")
    for t in (bx, bx + 20):
        ax.plot([t, t], [by - 0.9, by + 0.9], color=TEXT, lw=1.4, zorder=10)
    ax.text(bx + 10, by + 1.6, "200 m", ha="center", va="bottom", fontsize=10, zorder=10)
    nx, ny = x1 - 7, y1 - 12
    ax.add_patch(FancyBboxPatch((nx - 4, ny - 3.5), 8, 11, boxstyle="round,pad=0,rounding_size=1.5",
                                fc="white", ec="none", alpha=0.92, zorder=9))
    ax.annotate("", xy=(nx, ny + 4), xytext=(nx, ny - 1.5),
                arrowprops=dict(arrowstyle="-|>", color=TEXT, lw=1.6), zorder=10)
    ax.text(nx, ny + 4.6, "N", ha="center", va="bottom", fontsize=10, fontweight="bold", zorder=10)


def badge(ax, text):
    x0, _, _, y1 = VIEW
    ax.text(x0 + 3, y1 - 3, text, ha="left", va="top", fontsize=11, fontweight="bold", color="white", zorder=10,
            bbox=dict(boxstyle="round,pad=0.45,rounding_size=0.8", fc="#15240D", ec="none", alpha=0.9))


def new_map(tag):
    fig = plt.figure(figsize=(8, 7.2))
    ax = fig.add_axes([0.02, LEGEND_BAND, 0.96, 0.98 - LEGEND_BAND])
    landscape(ax)
    ax.set_xlim(VIEW[0], VIEW[1]); ax.set_ylim(VIEW[2], VIEW[3]); ax.set_aspect("equal")
    ax.set_xticks([]); ax.set_yticks([])
    for s in ax.spines.values():
        s.set_visible(False)
    badge(ax, tag)
    return fig, ax


def colorbar(fig, im, label, lo, hi, ticks, fmt):
    cax = fig.add_axes([0.2, 0.09, 0.6, 0.025])
    cb = fig.colorbar(im, cax=cax, orientation="horizontal")
    cb.outline.set_visible(False)
    cax.tick_params(length=0, labelsize=10, pad=4)
    cb.set_ticks(ticks); cb.set_ticklabels([fmt.format(t) for t in ticks])
    fig.text(0.19, 0.103, lo, ha="right", va="center", fontsize=11)
    fig.text(0.81, 0.103, hi, ha="left", va="center", fontsize=11)
    fig.text(0.5, 0.135, label, ha="center", va="bottom", fontsize=12, fontweight="bold")


def target_outline(ax, lw, color, ls="-", halo=False):
    t = np.ma.array(target.astype(float), mask=~mask)
    kw = dict(levels=[0.5], origin="lower", extent=(0, W, 0, H), zorder=5)
    if halo:
        cs = ax.contour(t, colors=["white"], linewidths=[lw + 2.5], **kw)
        cs.set_clip_path(PathPatch(CLIP, transform=ax.transData))
    cs = ax.contour(t, colors=[color], linewidths=[lw], linestyles=[ls], **kw)
    cs.set_clip_path(PathPatch(CLIP, transform=ax.transData))


def save(fig, name):
    # Ritaglia la fascia inferiore della figura (dove prima stavano legenda/didascalia/
    # colorbar, sotto l'asse della mappa che parte a y=LEGEND_BAND): la mappa vera e
    # propria (colori, contorni, badge, scala, freccia nord) resta invariata pixel per
    # pixel; il testo della legenda ora vive solo come componente React accanto all'immagine.
    from PIL import Image
    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=150, facecolor="white")
    plt.close(fig)
    img = Image.open(buf).convert("RGB")
    w, h = img.size
    crop_h = round(h * (1 - LEGEND_BAND))
    img = img.crop((0, 0, w, crop_h))
    img.save(OUT / f"{name}.webp", "WEBP", quality=90)


def gfield(shape, sigma, seed, m):
    f = gaussian_filter(np.random.default_rng(seed).normal(size=shape), sigma)
    return (f - f[m].mean()) / f[m].std()


# ---------------------------------------------------------------- dati sintetici
stable = gfield((H, W), 8, 1, mask)                       # componente stabile (suolo)
years = [0.75 * stable + 0.65 * gfield((H, W), 5, 20 + k, mask) for k in range(6)]
ystack = np.stack(years)
mean_z, sd_z = ystack.mean(0), ystack.std(0)

# 1) classi di stabilità storica
unstable = sd_z > np.quantile(sd_z[mask], 0.7)
hi_cls = mean_z > np.quantile(mean_z[mask], 0.6)
lo_cls = mean_z < np.quantile(mean_z[mask], 0.35)
stab = np.where(unstable, 1, np.where(hi_cls, 3, np.where(lo_cls, 0, 2)))  # 0 basso,1 instabile,2 medio,3 alto
stab_cols = ["#C9793F", "#B7AFCF", "#E6D9A8", "#3F6B2E"]
STAB_LABELS = {3: "Sempre alto", 2: "Nella media", 0: "Sempre basso", 1: "Variabile"}

# 2) stagione in corso: NDVI attuale + anomalie rispetto allo storico
gy, gx = np.mgrid[0:H, 0:W]
stress = np.zeros((H, W))
for k, (pi, du, dv, r) in enumerate([(1, 0.15, 0.1, 7.5), (2, -0.1, 0.0, 6.5), (3, 0.05, 0.2, 8.5)]):
    c = PARCELS[pi].mean(0) + np.array([du, dv]) * (PARCELS[pi].max(0) - PARCELS[pi].min(0))
    blob = np.exp(-(((gx - c[0]) / r) ** 2 + ((gy - c[1]) / (r * 0.8)) ** 2))
    stress += blob * (1 + 0.45 * gfield((H, W), 2.5, 300 + k, mask))
cur_z = 0.8 * stable + 0.4 * gfield((H, W), 4, 99, mask) - 2.6 * stress
ndvi = np.clip(0.74 + 0.04 * cur_z, 0.5, 0.9)
anom = cur_z - mean_z
target = (anom < np.quantile(anom[mask], 0.12)) | (lo_cls & ~unstable & (cur_z < np.quantile(cur_z[mask], 0.2)))
from scipy.ndimage import label as cc_label
target = binary_opening(target & inner, iterations=2)
target = binary_dilation(target, iterations=1)
tgt = np.zeros_like(target)
for core in per_parcel:                      # mai a cavallo di due appezzamenti
    lab_p, n_p = cc_label(target & core)
    for k in range(1, n_p + 1):
        if (lab_p == k).sum() >= 40:
            tgt |= lab_p == k
target = tgt

# 4) dati drone ad alta risoluzione nelle aree target
target_f = zoom(target.astype(float), F, order=0) > 0.5
ndvi_f = zoom(ndvi, F, order=1) + 0.012 * gfield((H * F, W * F), 1.5, 77, mask_f)
hi_f = zoom((stab == 3).astype(float), F, order=0) > 0.5
dose = np.where(hi_f, 0, 1)                                   # 0 ridotta (sempre alto), 1 standard
q1, q2 = np.quantile(ndvi_f[target_f & mask_f], [0.33, 0.66])
dose[target_f] = np.where(ndvi_f[target_f] < q1, 3, np.where(ndvi_f[target_f] < q2, 2, 1))

# ---------------------------------------------------------------- mappa 1: storico
def storico_map(isolate=None):
    # isolate: indice 0-3 in stab_cols da tenere colorato (le altre classi sfumano in grigio).
    # Genera le varianti che la legenda interattiva mostra cliccando una classe.
    cols = stab_cols if isolate is None else [c if i == isolate else MUTED for i, c in enumerate(stab_cols)]
    fig, ax = new_map("1 · Satellite · 6 anni")
    show(ax, stab, mask, cmap=ListedColormap(cols), vmin=-0.5, vmax=3.5)
    outline(ax); decorations(ax)
    return fig


save(storico_map(), "mappa-1-storico")
for idx, label in STAB_LABELS.items():
    save(storico_map(idx), f"mappa-1-storico-iso-{slug(label)}")

# ---------------------------------------------------------------- mappa 2: campionamento mirato
# Griglia tradizionale: 1 campione ogni 100 m (circa 1 per ettaro).
d_ = np.array([np.cos(ANG), np.sin(ANG)]); n_ = np.array([-np.sin(ANG), np.cos(ANG)])
grid_pts = []
for gu in np.arange(-40, 260, 10):
    for gv in np.arange(-40, 260, 10):
        q = gu * d_ + gv * n_
        iy, ix = int(q[1]), int(q[0])
        if 0 <= iy < H and 0 <= ix < W and inner[iy, ix]:
            grid_pts.append(q)
grid_pts = np.array(grid_pts)
# Campionamento mirato (stratificato): in ogni appezzamento, un prelievo per ogni zona
# abbastanza estesa, nel punto più rappresentativo (il più lontano dai bordi della zona).
smart = []
for core in per_parcel:
    for cls in range(4):
        region = (stab == cls) & inner & core
        if region.sum() < 60:
            continue
        dist = distance_transform_edt(region)
        smart.append((np.array(np.unravel_index(np.argmax(dist), dist.shape)), cls))
sp = np.array([c for c, _ in smart])


def campionamento_map(isolate_class=None, isolate_marker=None):
    # isolate_class: indice 0-3 in stab_cols da tenere colorato (le altre sfumano in grigio).
    # isolate_marker: "mirato" | "griglia" per mostrare solo quel tipo di prelievo.
    cols = stab_cols if isolate_class is None else [c if i == isolate_class else MUTED for i, c in enumerate(stab_cols)]
    fig, ax = new_map("2 · Suolo · campionamento mirato")
    show(ax, stab, mask, cmap=ListedColormap(cols), vmin=-0.5, vmax=3.5, alpha=0.55)
    outline(ax)
    if isolate_marker in (None, "griglia"):
        ax.scatter(grid_pts[:, 0], grid_pts[:, 1], s=16, c="white", edgecolors="#7A7A70", linewidths=0.9, zorder=8)
    if isolate_marker in (None, "mirato"):
        ax.scatter(sp[:, 1] + 0.5, sp[:, 0] + 0.5, s=130, c="white", edgecolors="#B23A2B", linewidths=3, zorder=9)
    decorations(ax)
    return fig


save(campionamento_map(), "mappa-2-campionamento")
for idx, label in STAB_LABELS.items():
    save(campionamento_map(isolate_class=idx), f"mappa-2-campionamento-iso-{slug(label)}")
for key, label in {"mirato": "Prelievo mirato", "griglia": "Griglia tradizionale (1/ha)"}.items():
    save(campionamento_map(isolate_marker=key), f"mappa-2-campionamento-iso-{slug(label)}")

# ---------------------------------------------------------------- mappa 2: stagione
ndvi_cmap = LinearSegmentedColormap.from_list("ndvi", ["#B98E5A", "#E6D39A", "#A9C77E", "#4E8A3E", "#15401F"])


def stagione_map(soglia=None):
    # soglia: se indicata, evidenzia in rosso i pixel con NDVI attuale sotto quel valore (stesso
    # dato "ndvi" della mappa base). Genera le varianti che la legenda interattiva in
    # MapCarousel.tsx mostra passando il cursore sulla scala del vigore.
    fig, ax = new_map("3 · Satellite · stagione in corso")
    im = show(ax, ndvi, mask, cmap=ndvi_cmap, vmin=0.62, vmax=0.82)
    if soglia is not None:
        show(ax, np.ones_like(ndvi), mask & (ndvi < soglia), z=5.5,
             cmap=ListedColormap(["#B23A2B"]), alpha=0.32)
    target_outline(ax, 2, "#B23A2B", "--", halo=True)
    outline(ax); decorations(ax)
    colorbar(fig, im, "Vigore attuale (NDVI) e aree anomale", "Basso", "Alto", [0.65, 0.70, 0.75, 0.80], "{:.2f}")
    return fig


# "Area da verificare" (contorno tratteggiato rosso) è spiegata nella legenda React, non più in un
# riquadro sovrapposto alla mappa.
save(stagione_map(), "mappa-3-stagione")
for soglia in (0.65, 0.70, 0.75, 0.80):
    save(stagione_map(soglia), f"mappa-3-stagione-soglia-{round(soglia * 100)}")

# ---------------------------------------------------------------- mappa 3: piano di volo
d = np.array([np.cos(ANG), np.sin(ANG)]); nrm = np.array([-np.sin(ANG), np.cos(ANG)])
lab, n = cc_label(target)
home = np.array([X[2, 3], Y[2, 3]]) + np.array([-3.0, -3.0])   # a bordo campo, sulla capezzagna
blocks = []
for k in range(1, n + 1):
    ys, xs = np.nonzero(lab == k)
    P = np.c_[xs + 0.5, ys + 0.5]
    a, b = P @ d, P @ nrm
    passes = []
    for i, off in enumerate(np.arange(b.min() + 1.2, b.max() - 0.4, 2.6)):   # passate ogni ~26 m
        sel = np.abs(b - off) < 1.3
        if sel.sum() < 2:
            continue
        seg = [a[sel].min() * d + off * nrm, a[sel].max() * d + off * nrm]
        passes.append(seg if len(passes) % 2 == 0 else seg[::-1])
    blocks.append(passes)
# ordine di visita: vicino più prossimo partendo dal decollo
order, cur, left = [], home, list(range(len(blocks)))
while left:
    j = min(left, key=lambda i: np.linalg.norm(blocks[i][0][0] - cur))
    order.append(j); left.remove(j); cur = blocks[j][-1][-1]


def volo_map(isolate=None):
    # isolate: "area" | "passate" | "trasferimento" | "decollo" (None = mostra tutta la legenda).
    fig, ax = new_map("4 · Drone · volo mirato")
    show(ax, ndvi, mask, cmap=ndvi_cmap, vmin=0.62, vmax=0.82, alpha=0.3)
    if isolate in (None, "area"):
        show(ax, np.ones_like(ndvi), target, z=5, cmap=ListedColormap(["#B23A2B"]), alpha=0.22)
        target_outline(ax, 1.6, "#B23A2B")
    cur = home
    for j in order:
        pts_b = np.array([p for seg in blocks[j] for p in seg])
        if isolate in (None, "trasferimento"):
            ax.plot([cur[0], pts_b[0, 0]], [cur[1], pts_b[0, 1]], color="#15240D", lw=1.3, ls=(0, (3, 3)), zorder=8)
        if isolate in (None, "passate"):
            ax.plot(pts_b[:, 0], pts_b[:, 1], color="white", lw=3.6, zorder=8, solid_joinstyle="round")
            ax.plot(pts_b[:, 0], pts_b[:, 1], color="#15240D", lw=1.7, zorder=9, solid_joinstyle="round")
        cur = pts_b[-1]
    if isolate in (None, "trasferimento"):
        ax.plot([cur[0], home[0]], [cur[1], home[1]], color="#15240D", lw=1.3, ls=(0, (3, 3)), zorder=8)
    if isolate in (None, "decollo"):
        ax.scatter(*home, s=170, marker="s", c="#15240D", edgecolors="white", linewidths=2, zorder=10)
    decorations(ax)
    return fig


save(volo_map(), "mappa-4-volo")
VOLO_LABELS = {"area": "Area da sorvolare", "passate": "Passate di rilievo",
               "trasferimento": "Trasferimento", "decollo": "Decollo"}
for key, label in VOLO_LABELS.items():
    save(volo_map(key), f"mappa-4-volo-iso-{slug(label)}")

# ---------------------------------------------------------------- mappa 4: prescrizione
dose_cols = ["#9DBB86", "#EFE3BF", "#DE9A4C", "#A33A1F"]
DOSE_LABELS = {0: "Dose −25%", 1: "Dose standard", 2: "Dose +25%", 3: "Dose +50%"}


def biostim_map(isolate=None):
    # isolate: indice 0-3 in dose_cols da tenere colorato (le altre classi sfumano in grigio).
    cols = dose_cols if isolate is None else [c if i == isolate else MUTED for i, c in enumerate(dose_cols)]
    fig, ax = new_map("5 · Drone · biostimolanti")
    show(ax, dose, mask_f, cmap=ListedColormap(cols), vmin=-0.5, vmax=3.5)
    outline(ax); decorations(ax)
    return fig


save(biostim_map(), "mappa-5-biostimolanti")
for idx, label in DOSE_LABELS.items():
    save(biostim_map(idx), f"mappa-5-biostimolanti-iso-{slug(label)}")
print("ok", n, "aree target")
