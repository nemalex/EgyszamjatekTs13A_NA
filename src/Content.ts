import fs, { writev } from "fs"; //File System
import http from "http";
import url from "url";
import Játékos from "./Játékos";
import Megoldás from "./Megoldás";

// Függvény definiálása:
/*function összead(a: number, b: number): number {
    return a + b;
}*/

export default class Content {
    public content(req: http.IncomingMessage, res: http.ServerResponse): void {
        // favicon.ico kérés kiszolgálása:
        if (req.url === "/favicon.ico") {
            res.writeHead(200, { "Content-Type": "image/x-icon" });
            fs.createReadStream("favicon.ico").pipe(res);
            return;
        }
        // Weboldal inicializálása + head rész:
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.write("<!DOCTYPE html>");
        res.write("<html lang='hu'>");
        res.write("<head>");
        res.write("<style>input, pre {font-family:monospace; font-size:1em; font-weight:bold;}</style>");
        res.write("<meta name='viewport' content='width=device-width, initial-scale=1.0'>");
        res.write("<title>Egyszámjáték</title>");
        res.write("</head>");
        res.write("<body><form><pre class='m-3'>");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const params = url.parse(req.url as string, true).query;

        // Kezd a kódolást innen -->

        //2. adatok beolvasása, tárolása
        const megold: Megoldás = new Megoldás("egyszamjatek.txt");

        if (!megold.sikeresBeolvasás) {
            res.write("Hiba az egyszámjáték.txt beolvasásakor");
            res.write("</pre></form>");
            res.write("</body></html>");
            res.end();
        }

        /*const megold: Megoldás;
        try {
            megold = new Megoldás("egyszamjatek.txt");
        } catch (error) {
            res.write("Hiba az egyszámjáték.txt beolvasásakor");
            res.write("</pre></form>");
            res.write("</body></html>");
            res.end();
        }*/

        res.write(`3. feladat: Játékosok száma: ${megold.játékosokSzáma}\n`);
        res.write(`4. feladat: Fordulók száma: ${megold.fordulókSzáma}\n`);
        res.write(`5. feladat: Az első fordulóban ${megold.voltEgyesTipp ? "" : "nem "}volt egyes tipp\n`);
        res.write(`6. feladat: A legnagyobb tipp a fordulók során: ${megold.játéklegnagyobbTipp}\n`);

        let inputFordulo: number = parseInt(params.inputFordulo as string);
        if (isNaN(inputFordulo) || inputFordulo < 1 || inputFordulo > megold.fordulókSzáma) {
            inputFordulo = 1;
        }
        res.write(`7. feladat: Kérem a forduló sorszámát [1-${megold.fordulókSzáma}]: <input type='number' name='inputFordulo' value=${inputFordulo} style='max-width:100px;' onChange='this.form.submit();'>\n`);

        const nyertesTipp: null | number = megold.nyertesTipp(inputFordulo);
        if (nyertesTipp != null) {
            res.write(`8. feladat: A nyertes tipp a fordulóban: ${nyertesTipp}\n`);
        } else {
            res.write("8. feladat: Nem volt egyedi tipp a megadott fordulóban!\n");
        }

        const nyertesJátékos: null | Játékos = megold.nyertesJátékos(inputFordulo);
        if (nyertesTipp != null) {
            res.write(`9. feladat: A megadott forduló nyertese: ${nyertesJátékos?.név}\n`);
        } else {
            res.write("9. feladat: Nem volt nyertes a megadott fordulóban!\n");
        }
        //10. feladat
        if (nyertesJátékos && nyertesTipp) {
            megold.állománybaÍr("nyertes.txt", inputFordulo, nyertesTipp, nyertesJátékos.név);
        } else {
            res.write("10. feladat: Nem volt nyertes a megadott fordulóban\n");
            try {
                fs.unlinkSync("nyertes.txt"); //fájl törlése
            } catch (error) {
                console.log(`Hiba: ${(error as Error).message}`);
            }
        }

        // innentől nem a feladat része
        res.write("\n<u>egyszamjatek.txt:</u>\n");
        fs.readFileSync("egyszamjatek.txt")
            .toString()
            .split("\n")
            .forEach(i => {
                res.write(`${i.trim()}\n`);
            });

        res.write("\n<u>nyertes.txt:</u>\n");
        try {
            fs.readFileSync("nyertes.txt")
                .toString()
                .split("\n")
                .forEach(i => {
                    res.write(`${i.trim()}\n`);
                });
        } catch (error) {
            res.write("Hiba: " + (error as Error).message + "\n");
        }
        res.write("Hi:3");
        // <---- Fejezd be a kódolást

        res.write("</pre></form>");
        res.write("</body></html>");
        res.end();
    }
}
