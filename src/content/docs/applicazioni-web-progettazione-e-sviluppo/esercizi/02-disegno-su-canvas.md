---
title: Disegno di Punti su Canvas
description: Esercizio guidato - disegnare punti su canvas con soglia regolabile, uso di funzioni, filter, map e forEach.
sidebar:
  order: 2
---

## Consegna

Costruire un'applicazione che:

1. Definisca un'area in cui disegnare punti con un clic del mouse.
2. Divida l'area verticalmente con una soglia (*threshold*).
3. Disegni punti di colore diverso nelle due aree.
4. Permetta di spostare la soglia con uno slider.
5. Cambi i colori dei punti allo spostamento della soglia, per mantenere la coerenza.

## Il Programma di Partenza

Il programma dato realizza i primi tre punti.

```html
<canvas id="myCanvas" width="400" height="200" style="border:1px solid #d3d3d3;"></canvas>
<div id="tag"><p id="demo"></p></div>
<input type="range" id="myRange" min="0" max="400" step="10">
<label for="myRange">Set threshold</label>
<p>Threshold value: <span id="myFilter"></span></p>
```

```javascript
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");           // contesto per disegnare in 2D

canvas.addEventListener("click", function (event) {
    let cX = event.clientX;
    let cY = event.clientY;
    ctx.beginPath();                           // inizia un nuovo disegno
    ctx.arc(cX, cY, 5, 0, 2 * Math.PI);        // centro, raggio, angoli
    if (cX < 200)
        ctx.fillStyle = "red";
    else
        ctx.fillStyle = "blue";
    ctx.fill();                                // rende visibile il disegno
});

const slider = document.getElementById("myRange");
slider.addEventListener("change", function (event) {
    document.getElementById("myFilter").innerHTML = slider.value;
});

ctx.beginPath();
ctx.moveTo(200, 0);                            // punto di partenza
ctx.lineTo(200, 200);                          // punto successivo
ctx.lineWidth = 2;
ctx.strokeStyle = "magenta";
ctx.stroke();                                  // rende visibile la linea
```

| Istruzione | Effetto |
| --- | --- |
| `getContext("2d")` | Ottiene l'oggetto con cui disegnare |
| `beginPath()` | Inizia un nuovo disegno |
| `arc(x, y, r, da, a)` | Traccia un arco o un cerchio |
| `moveTo`, `lineTo` | Tracciano una linea |
| `fillStyle`, `strokeStyle` | Colori di riempimento e di contorno |
| `fill()`, `stroke()` | Rendono visibile il disegno |
| `rect(x, y, w, h)` | Traccia un rettangolo |

:::caution[Il canvas non ha memoria]
Il canvas è una superficie di pixel: una volta disegnato, **non ricorda** cosa c'è sopra. Per cambiare qualcosa bisogna ridisegnare, ed è il punto chiave dell'esercizio.
:::

## Punto 4: Spostare la Soglia

Il ragionamento è questo:

- Serve conoscere la posizione attuale, quindi si definisce una variabile `threshold`.
- Spostare la linea significa cancellare la vecchia e disegnare la nuova.
- L'operazione si ripete, quindi conviene una **funzione**.

Per "cancellare", si ridisegna la linea del colore dello sfondo.

```javascript
let threshold = 200;

function drawThreshold(threshold, color) {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(threshold, 0);
    ctx.lineTo(threshold, 200);
    ctx.strokeStyle = color;
    ctx.stroke();
}

slider.addEventListener("change", function (event) {
    drawThreshold(threshold, "yellow");     // cancella la vecchia
    threshold = parseInt(slider.value);
    drawThreshold(threshold, "magenta");    // disegna la nuova
    document.getElementById("myFilter").innerHTML = slider.value;
});

// sfondo giallo
ctx.rect(0, 0, 400, 200);
ctx.fillStyle = "yellow";
ctx.fill();
drawThreshold(threshold, "magenta");
```

Il valore dello slider è una stringa, quindi serve `parseInt`.

## Punto 5: Cambiare i Colori

Per ridisegnare i punti bisogna **ricordarli**, dato che il canvas non lo fa. Si definisce un array `points` di oggetti con le coordinate, e una funzione `drawPoint`.

```javascript
const points = [];

function drawPoint(point) {
    ctx.beginPath();
    ctx.arc(point.cX, point.cY, 5, 0, 2 * Math.PI);
    if (point.cX < threshold)
        ctx.fillStyle = "red";
    else
        ctx.fillStyle = "blue";
    ctx.fill();
}

canvas.addEventListener("click", function (event) {
    let point = {cX: event.clientX, cY: event.clientY};
    drawPoint(point);
    points.push(point);
});

slider.addEventListener("change", function (event) {
    drawThreshold(threshold, "yellow");
    threshold = parseInt(slider.value);
    drawThreshold(threshold, "magenta");
    for (let p of points) {
        drawPoint(p);
    }
});
```

## Punto Extra: Ridisegnare Solo il Necessario

La soluzione funziona, ma ridisegna **tutti** i punti ogni volta. Conviene ridisegnare solo quelli che cambiano colore, cioè quelli tra la vecchia e la nuova soglia. È il compito di `filter`.

```javascript
function inRange(min, max) {
    return function (value) {
        return value.cX > min && value.cX < max;
    };
}

slider.addEventListener("change", function (event) {
    let oldThreshold = threshold;
    let pointsToChangeColor = [];
    drawThreshold(threshold, "yellow");
    threshold = parseInt(slider.value);
    drawThreshold(threshold, "magenta");
    if (oldThreshold < threshold) {
        pointsToChangeColor = points.filter(inRange(oldThreshold, threshold));
    } else {
        pointsToChangeColor = points.filter(inRange(threshold, oldThreshold));
    }
    for (let p of pointsToChangeColor) {
        drawPoint(p);
    }
});
```

`inRange` è una **funzione che restituisce una funzione**: `filter` vuole una funzione con un solo parametro, e `inRange` ne costruisce una che ricorda `min` e `max`.

## Ombreggiatura

**Nuovo requisito**: un bottone aggiunge un'ombra ai punti.

Il colore dipendeva dalla posizione, ma l'ombra deve essere grigia: conviene **associare il colore ai punti** con un *refactoring*, in modo che `drawPoint` usi `point.color`.

```javascript
function drawPoint(point) {
    ctx.beginPath();
    ctx.arc(point.cX, point.cY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = point.color;
    ctx.fill();
}
```

L'ombra è una copia dei punti spostata di 3 pixel:

```javascript
function drawShadow() {
    let pointsShadow = points.map(makeShadow);
    pointsShadow.forEach(drawPoint);    // prima le ombre
    points.forEach(drawPoint);          // poi i punti, sopra
}

function makeShadow(value) {
    let temp = Object.assign({}, value);    // copia dell'oggetto
    temp.cX += 3;
    temp.color = "lightgrey";
    return temp;
}

document.getElementById("shadow").addEventListener("click", drawShadow);
```

:::caution[Perché Object.assign]
Una variabile con un oggetto contiene un **riferimento**: `let temp = value` non copia, e modificando `temp` si cambierebbe il punto originale. `Object.assign({}, value)` crea un nuovo oggetto.
:::

**Da completare**: far disegnare con l'ombra anche i nuovi punti, ricordando se l'ombra è attiva.

<details>
<summary>Soluzione</summary>

Si usa una variabile di stato, e il gestore del clic disegna l'ombra prima del punto:

```javascript
let shadowOn = false;

function drawShadow() {
    shadowOn = true;
    points.map(makeShadow).forEach(drawPoint);
    points.forEach(drawPoint);
}

canvas.addEventListener("click", function (event) {
    let point = {cX: event.clientX, cY: event.clientY};
    point.color = point.cX < threshold ? "red" : "blue";
    if (shadowOn) {
        drawPoint(makeShadow(point));
    }
    drawPoint(point);
    points.push(point);
});
```

</details>
