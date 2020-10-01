import Játékos from "./Játékos";
import fs from "fs";
import { resolve } from "path";

export default class Megoldás {
    private _játékosok: Játékos[] = [];
    private _sikeresBeolvasás: boolean = true;
    private _fájl: string[] = [];

    //jellemző definiálása
    public get sikeresBeolvasás(): boolean {
        return this._sikeresBeolvasás;
    }
    public get játékosokSzáma(): number {
        return this._játékosok.length;
    }

    public get fordulókSzáma(): number {
        return this._játékosok[0].fordulókSzáma;
    }

    public get voltEgyesTipp(): boolean {
        let voltEgyesTipp: boolean = false;
        for (const i of this._játékosok) {
            if (i.elsőFordulóTippje === 1) {
                voltEgyesTipp = true;
                break;
            }
        }
        return voltEgyesTipp;
    }

    public get játéklegnagyobbTipp(): number {
        let játéklegnagyobbTipp: number = 0;
        for (const i of this._játékosok) {
            if (i.játékoslegnagyobbTipp > játéklegnagyobbTipp) {
                játéklegnagyobbTipp = i.játékoslegnagyobbTipp;
            }
        }
        return játéklegnagyobbTipp;
    }

    public nyertesTipp(forduló: number): null | number {
        const stat: number[] = new Array(100).fill(0); //100 elemű vektor 0-kkal feltöltve
        this._játékosok.forEach(i => {
            stat[i.fordulóTippje(forduló)]++;
        });
        let nyertesTipp: null | number = null;
        for (let i = 0; i < stat.length; i++) {
            if (stat[i] === 1) {
                nyertesTipp = i;
                break;
            }
        }
        return nyertesTipp;
    }

    public nyertesJátékos(forduló: number): null | Játékos {
        let nyertes: null | Játékos = null;
        const nyertesTipp: null | number = this.nyertesTipp(forduló);
        if (nyertesTipp != null) {
            for (const i of this._játékosok) {
                if (i.fordulóTippje(forduló) === nyertesTipp) {
                    nyertes = i;
                    break;
                }
            }
        }
        return nyertes;
    }

    constructor(forrás: string) {
        try {
            fs.readFileSync(forrás)
                .toString()
                .split("\n")
                .forEach(i => {
                    const aktSor: string = i.trim(); //vezérlő karakterek levágása
                    this._játékosok.push(new Játékos(aktSor));
                });
        } catch (error) {
            console.log(`Hiba: ${(error as Error).message}`);
            this._sikeresBeolvasás = false;
        }
    }

    public állománybaÍr(állományNév: string, forduló: number, tipp: number, játékosNév: string): void {
        const ki: string[] = [];
        ki.push(`Forduló sorszáma: ${forduló}.`);
        ki.push(`Nyertes tipp: ${tipp}`);
        ki.push(`Nyertes játékos: ${játékosNév}`);
        fs.writeFileSync(állományNév, ki.join("\r\n"));
    }
}
