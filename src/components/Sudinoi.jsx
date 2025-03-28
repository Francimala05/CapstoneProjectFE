import React from "react";
import "../assets/styles/Sudinoi.css";
import FotoStory from "../assets/images/PizzaPazzaStory1.jpg";
import FotoFamily from "../assets/images/FotoFamily.jpg";
function Sudinoi() {
  return (
    <>
      <h1 className="text-warning mb-5">Su di noi!</h1>
      <div className="container-sudinoi text-warning">
        <div className="text">
          <p>
            Cultura, tradizione, storia e gusto segnano tutta la nostra bella
            Italia. In ogni angolo si respirano nuovi odori e tradizioni. Tra i
            Monti Lattari c'è una città unica che si differenzia per i suoi
            nuovi e vecchi sapori: Gragnano. Situata nel cuore della costiera
            sorrentina, Gragnano ha radici storiche che risalgono all'epoca
            romana e, oltre a essere la capitale europea della pasta, è famosa
            anche per il suo Vino DOC, rosso frizzante, che viene prodotto nelle
            colline intorno alla città. Lì, proprio al centro di Gragnano, a
            fianco delle più rinomate piccole fabbriche di pasta artigianale,
            che ancora resistono sul territorio, troverete pane, pizza e
            panuozzo per i vostri denti. La famiglia Malafronte è composta da
            maestri fornai e panificatori, fin dagli inizi degli anni '50 a
            Gragnano. Luigi Malafronte, conosciuto come "Luigi o' furnar", è
            stato uno dei primi a iniziare il lavoro in pizzeria.
          </p>
        </div>
        <div className="image">
          <img
            src={FotoStory}
            alt="Foto Storica"
            className="image-content animated-image"
          />
        </div>
      </div>

      <div className="container-sudinoi reverse text-warning text-right">
        <div className="image">
          <img
            src={FotoFamily}
            alt="Foto di Famiglia"
            className="image-content animated-image"
          />
        </div>
        <div className="text">
          <p>
            Una delle prime pizzerie (1968) di Gragnano era situata in piazza
            Amendola (oggi Via Tommaso Sorrentino). Già da piccoli, all'età di 7
            anni, tutti i fratellini e le sorelline venivano introdotti dal papà
            nel mondo della farina. A volte questi piccoli si riposavano
            addirittura sui sacchi di farina. È stato anche lui ad ideare quello
            che sarà poi conosciuto nella zona e oltre i confini come il
            Panuozzo, un leggero pezzo di pane cotto nel forno a legna. Prese un
            pezzo di pane detto "Cafone", lo aprì e all'interno lo farcì con
            sugna e lardo, ricuocendolo nel forno, facendogli prendere un sapore
            croccante e morbido al tempo stesso. Tra nostalgia e tradizione, uno
            dei suoi nipoti, <b>Leandro Malafronte</b>, con la sua "Pizza
            Pazza", cerca di ammaliare palati in cerca di fantasia, gusto e
            passione.
          </p>
        </div>
      </div>
    </>
  );
}

export default Sudinoi;
