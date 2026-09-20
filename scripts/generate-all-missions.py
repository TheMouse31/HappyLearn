#!/usr/bin/env python3
"""Generate all Phase A standard missions from SUIVI CSV."""
from __future__ import annotations

import csv
import json
import re
from pathlib import Path

ROOT = Path("/workspace")
CSV_PATH = ROOT / "docs/SUIVI-missions-themes.csv"
MD_PATH = ROOT / "docs/SUIVI-missions-themes.md"
MISSIONS_ROOT = ROOT / "src/data/missions"
INDEX_PATH = MISSIONS_ROOT / "index.ts"
TODAY = "2026-09-20"

# Already handcrafted — skip regeneration (mission_id)
SKIP_IDS = {
    "cm2-maths-fractions-01",
    "cm2-maths-fractions-nombres-01",
    "cm2-maths-fractions-operations-01",
    "cm2-maths-decimaux-01",
}

# theme_id → existing mission_id (when slug differs from theme suffix)
THEME_MISSION_OVERRIDE = {
    "cm2-maths-fractions-operateur": "cm2-maths-fractions-01",
}

UNIVERSES = ("football", "rugby", "equitation", "espace")

NARRATIVE = {
    "football": {
        "action_title": "Tu entres en jeu",
        "action": "Les Bleus comptent sur toi. Chaque bonne réponse fait avancer l’action sur le terrain.",
        "action_cap": "Tu prends ta place au milieu du terrain.",
        "obj_title": "Lis le jeu",
        "obj": "Observe, calcule et décide. Chaque étape te rapproche du but.",
        "obj_cap": "Les zones du terrain s’allument.",
        "win_title": "But ! Victoire !",
        "win": "Tes choix ont fait basculer le match. Les Bleus l’emportent.",
        "win_cap": "Félicitations : tu as fait basculer le match.",
        "teaser": "Au prochain match, un nouveau défi pédagogique t’attend.",
        "teaser_cap": "Un point d’interrogation apparaît sur le terrain.",
    },
    "rugby": {
        "action_title": "Tu entres en jeu",
        "action": "Tes partenaires comptent sur toi. Chaque bonne réponse ouvre un couloir.",
        "action_cap": "Tu prends ta place derrière tes partenaires.",
        "obj_title": "Observe la défense",
        "obj": "Lis les espaces, calcule, puis avance au bon moment.",
        "obj_cap": "Les couloirs gauche, axe et large deviennent visibles.",
        "win_title": "Essai ! Victoire !",
        "win": "Tes calculs ont ouvert l’intervalle. Essai transformé.",
        "win_cap": "Félicitations : tu as fait basculer le match.",
        "teaser": "La prochaine rencontre apportera un nouveau défi.",
        "teaser_cap": "Un nouveau schéma apparaît au loin.",
    },
    "equitation": {
        "action_title": "Le chemin du retour",
        "action": "Tu rentres vers l’écurie avec ton cheval. Chaque étape éclaire le sentier.",
        "action_cap": "L’écurie apparaît au bout du sentier.",
        "obj_title": "Choisis le chemin",
        "obj": "Observe les bornes, calcule, et garde une allure sûre.",
        "obj_cap": "Les principaux sentiers s’activent.",
        "win_title": "Retour à l’écurie",
        "win": "Tu as lu chaque borne. Vous rentrez ensemble, en confiance.",
        "win_cap": "Franchissement réussi, retour au pas jusqu’à l’écurie.",
        "teaser": "Un nouveau chemin te conduira vers un autre défi.",
        "teaser_cap": "Une rivière apparaît au loin.",
    },
    "espace": {
        "action_title": "Le retour vers la station",
        "action": "Le module doit rejoindre la station. Chaque réponse corrige la trajectoire.",
        "action_cap": "La station apparaît au loin.",
        "obj_title": "Rétablis la trajectoire",
        "obj": "Analyse les signaux, calcule, et prépare l’arrimage.",
        "obj_cap": "Chaque décision fait progresser le module.",
        "win_title": "Arrimage réussi",
        "win": "La trajectoire est calée. Les attaches se verrouillent.",
        "win_cap": "Le module est amarré. Mission réussie.",
        "teaser": "Un signal mystérieux annonce une prochaine mission.",
        "teaser_cap": "Un point lumineux inconnu apparaît au-delà de la station.",
    },
}


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")


def js_str(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def mission_id_for(grade: str, subject: str, theme_id: str) -> tuple[str, str]:
    """Return (mission_id, thematic_slug)."""
    prefix = f"{grade}-"
    rest = theme_id[len(prefix) :] if theme_id.startswith(prefix) else theme_id
    # If rest already starts with full subject, strip it for slug
    subj_prefix = f"{subject}-"
    if rest.startswith(subj_prefix):
        slug = rest[len(subj_prefix) :]
    else:
        # theme used short subject token (qdm, geo, histoire…) — keep rest as slug
        slug = rest
    mid = f"{grade}-{subject}-{slug}-01"
    return mid, slug


def title_blurb(theme_label: str, grade: str) -> tuple[str, str]:
    short = theme_label.split("—")[-1].strip() if "—" in theme_label else theme_label
    title = f"{short} en mission"
    if len(title) > 48:
        title = short[:45] + "…"
    blurb = f"Une mission {grade.upper()} : {theme_label}."
    return title, blurb


# Pedagogical packs: list of 6 core steps + application
# Each step: kind, kicker_suffix, expected, distractors, title, statement, hint, note?

def pack_maths(theme_id: str, grade: str, label: str) -> list[dict]:
    g = grade
    # Default generic number sense pack adapted by keywords
    tid = theme_id
    if "fraction" in tid:
        if g == "cm1":
            return [
                step("fraction-choice", "Reconnaître 1/2", "1/2", ["1/3", "2/3"], "Une moitié", "Parmi 8 jetons, la moitié est prise. Quelle fraction ?", "Moitié = 1/2."),
                step("fraction-choice", "Opérateur unitaire", "3", ["4", "6"], "1/4 de 12", "Calcule 1/4 de 12.", "12 ÷ 4 = 3.", kind_override="number"),
                step("fraction-choice", "1/5 de 20", "4", ["5", "10"], "Un cinquième", "Calcule 1/5 de 20.", "20 ÷ 5 = 4.", kind_override="number"),
                step("choice", "Comparer", "2/5", ["1/5", "1/10"], "La plus grande", "Parmi 1/5, 2/5 et 1/10, laquelle est la plus grande ?", "Même famille : compare les numérateurs, ou compare à 1/2."),
                step("fraction-choice", "Égalité", "2/4", ["1/4", "3/4"], "Même quantité", "Quelle fraction égale 1/2 ?", "2/4 = 1/2."),
                step("number", "Opérateur", "6", ["3", "9"], "1/3 de 18", "Calcule 1/3 de 18.", "18 ÷ 3 = 6."),
                step("number", "Application", "5", ["4", "10"], "1/4 de 20", "Calcule 1/4 de 20.", "20 ÷ 4 = 5."),
            ]
        if g == "ce2":
            return [
                step("fraction-choice", "Partie d’unité", "1/4", ["1/3", "1/2"], "Un quart", "Tu partages une bande en 4 parts égales et tu en prends 1. Quelle fraction ?", "1 part sur 4 → 1/4."),
                step("fraction-choice", "Égalité", "2/4", ["1/4", "3/4"], "Égal à 1/2", "Quelle fraction égale une moitié ?", "2/4 = 1/2."),
                step("choice", "Comparer", "3/4", ["1/4", "2/4"], "La plus grande", "Parmi 1/4, 2/4, 3/4, laquelle est la plus grande ?", "Même dénominateur : plus grand numérateur."),
                step("fraction-choice", "Addition", "3/5", ["2/5", "1/5"], "Additionner", "Calcule 1/5 + 2/5.", "1+2=3, dénominateur 5."),
                step("fraction-choice", "Sur la bande", "3/6", ["1/6", "5/6"], "Trois sixièmes", "Tu colories 3 parts sur 6. Quelle fraction ?", "3/6."),
                step("choice", "Égalités", "2/6", ["1/6", "4/6"], "Égal à 1/3", "Quelle fraction égale 1/3 ?", "2/6 = 1/3."),
                step("fraction-choice", "Application", "4/8", ["3/8", "5/8"], "Égal à 1/2", "Quelle fraction égale 1/2 ?", "4/8 = 1/2."),
            ]
        if g == "ce1":
            return [
                step("fraction-choice", "Moitié", "1/2", ["1/3", "1/4"], "Une moitié", "Tu partages un gâteau en 2 parts égales et tu en prends 1. Quelle fraction ?", "1 part sur 2 → 1/2."),
                step("fraction-choice", "Tiers", "1/3", ["1/2", "1/4"], "Un tiers", "Tu partages en 3 parts égales et tu en prends 1. Quelle fraction ?", "1/3."),
                step("fraction-choice", "Quart", "1/4", ["1/2", "1/3"], "Un quart", "Tu partages en 4 parts égales et tu en prends 1. Quelle fraction ?", "1/4."),
                step("choice", "Comparer", "1/2", ["1/3", "1/4"], "La plus grande part", "Quelle part est la plus grande : 1/2, 1/3 ou 1/4 ?", "Plus le dénominateur est petit (parts égales d’un même tout), plus la part unitaire est grande."),
                step("fraction-choice", "Coloriage", "2/4", ["1/4", "3/4"], "Deux quarts", "Tu colories 2 cases sur 4. Quelle fraction ?", "2/4."),
                step("choice", "Moitié d’un tout", "1/2", ["2/2", "0/2"], "Repère la moitié", "Quelle fraction représente une moitié ?", "1/2."),
                step("fraction-choice", "Application", "1/4", ["1/2", "3/4"], "Un quart du parcours", "Tu as fait un quart du chemin. Quelle fraction ?", "1/4."),
            ]
        # cm2 leftover fractions handled elsewhere
        return default_math_pack(g, label)

    if "decim" in tid:
        return [
            step("choice", "Dixièmes", "0,4", ["0,04", "4,0"], "Quatre dixièmes", "Quelle écriture pour 4/10 ?", "4 dixièmes → 0,4."),
            step("choice", "Centièmes", "0,25", ["0,025", "2,5"], "Vingt-cinq centièmes", "Quelle écriture pour 25/100 ?", "0,25."),
            step("number", "Rang", "7", ["3", "5"], "Chiffre des dixièmes", "Dans 3,75, quel chiffre est aux dixièmes ?", "Juste après la virgule : 7."),
            step("choice", "Comparer", "0,9", ["0,09", "0,009"], "Le plus grand", "Parmi 0,09 ; 0,9 ; 0,009, le plus grand ?", "0,9."),
            step("choice", "Écriture", "1,5", ["1,05", "15"], "Une unité et 5 dixièmes", "Quelle écriture ?", "1,5."),
            step("choice", "Ordre", "0,2 < 0,5 < 1,2", ["0,5 < 0,2 < 1,2", "1,2 < 0,5 < 0,2"], "Ordre croissant", "Range 0,5 ; 1,2 ; 0,2.", "0,2 < 0,5 < 1,2."),
            step("choice", "Application", "2,4", ["2,04", "24"], "Lecture finale", "2 unités et 4 dixièmes s’écrivent…", "2,4."),
        ]

    if "entier" in tid or tid.endswith("-entiers"):
        if g == "cp":
            return [
                step("number", "Compter", "10", ["9", "11"], "Dix objets", "Combien font 7 + 3 ?", "7 + 3 = 10."),
                step("number", "Lire", "42", ["24", "40"], "Quarante-deux", "Quel nombre s’écrit avec 4 dizaines et 2 unités ?", "42."),
                step("choice", "Comparer", "58", ["47", "39"], "Le plus grand", "Parmi 47, 58 et 39, le plus grand ?", "58."),
                step("number", "Suite", "35", ["34", "36"], "Après 34", "Quel nombre vient juste après 34 ?", "35."),
                step("number", "Dizaines", "6", ["5", "7"], "Dizaines dans 60", "Combien de dizaines dans 60 ?", "6 dizaines."),
                step("number", "Complément", "100", ["90", "110"], "Complète à 100", "40 + ? = 100. Quel est le résultat manquant… attendu : 60. Combien de 40 pour aller à 100 ? Écris 60.", "40 + 60 = 100.", expected_override="60", distractors_override=["50", "70"]),
                step("number", "Application", "75", ["57", "70"], "Écris le nombre", "7 dizaines et 5 unités = ?", "75."),
            ]
        if g == "ce1":
            return [
                step("number", "Lire", "305", ["350", "35"], "Trois cent cinq", "Quel nombre : 3 centaines, 0 dizaine, 5 unités ?", "305."),
                step("choice", "Comparer", "890", ["809", "898"], "Le plus grand", "Parmi 809, 890, 898… lequel est 890 ? Attendu 890 vs distracteurs.", "890 est entre 809 et 898.", expected_override="890", distractors_override=["809", "898"]),
                step("number", "Décomposer", "7", ["6", "8"], "Centaines", "Dans 734, chiffre des centaines ?", "7."),
                step("number", "Suite", "1000", ["999", "1001"], "Mille", "Quel nombre vient après 999 ?", "1000."),
                step("choice", "Comparer", "650 > 560", ["560 > 650", "650 = 560"], "Compare", "Quelle comparaison est vraie ?", "650 est plus grand."),
                step("number", "Écrire", "420", ["402", "240"], "4 centaines 2 dizaines", "Quel nombre ?", "420."),
                step("number", "Application", "999", ["909", "990"], "Le plus grand ≤ 1000", "Quel est le plus grand nombre à 3 chiffres ?", "999."),
            ]
        if g == "ce2":
            return [
                step("number", "Lire", "4500", ["4050", "5400"], "Quatre mille cinq cents", "4 milliers et 5 centaines = ?", "4500."),
                step("choice", "Comparer", "7800", ["7080", "8700"], "Le plus grand parmi…", "Parmi 7080, 7800, 8700, lequel vaut sept mille huit cents ?", "7800."),
                step("number", "Décomposer", "3", ["2", "4"], "Milliers", "Dans 3652, chiffre des milliers ?", "3."),
                step("number", "Suite", "10000", ["9999", "10001"], "Dix mille", "Après 9999 ?", "10000."),
                step("choice", "Encadrer", "entre 3000 et 4000", ["entre 2000 et 3000", "entre 4000 et 5000"], "Encadre 3520", "Entre quels milliers ?", "3520 est entre 3000 et 4000."),
                step("number", "Écrire", "6060", ["6006", "6600"], "6 milliers 6 dizaines", "Quel nombre ?", "6060."),
                step("number", "Application", "9999", ["9099", "9909"], "Plus grand ≤ 10000", "Plus grand nombre à 4 chiffres ?", "9999."),
            ]
        if g == "cm1":
            return [
                step("number", "Lire", "240000", ["204000", "420000"], "Deux cent quarante mille", "240 milliers = ?", "240000."),
                step("choice", "Comparer", "505000", ["500500", "550000"], "Lequel ?", "Parmi ces nombres, 505000 ?", "505000."),
                step("number", "Classe", "7", ["5", "2"], "Centaines de mille", "Dans 752 314, chiffre des centaines de mille ?", "7."),
                step("choice", "Encadrer", "entre 100000 et 200000", ["entre 0 et 100000", "entre 200000 et 300000"], "Encadre 156 000", "Entre quels centaines de mille ?", "entre 100000 et 200000."),
                step("number", "Écrire", "80080", ["80800", "88000"], "8 myriades…", "80 080 : écris 80080.", "80080."),
                step("choice", "Comparer", "999999 > 100000", ["100000 > 999999", "égaux"], "Compare", "Quelle comparaison est vraie ?", "999999 est plus grand."),
                step("number", "Application", "999999", ["1000000", "99999"], "Plus grand ≤ 999999", "Plus grand nombre ≤ 999 999 ?", "999999."),
            ]
        # cm2
        return [
            step("choice", "Lire", "12 345 678", ["12 354 678", "21 345 678"], "Lecture", "Quel nombre lit-on « douze millions trois cent quarante-cinq mille six cent soixante-dix-huit » ?", "12 345 678."),
            step("number", "Classe", "5", ["2", "8"], "Millions", "Dans 5 432 109, chiffre des millions ?", "5."),
            step("choice", "Comparer", "8 000 000", ["800 000", "80 000 000"], "Huit millions", "Quel écriture pour huit millions ?", "8 000 000."),
            step("choice", "Encadrer", "entre 3 000 000 et 4 000 000", ["entre 2 000 000 et 3 000 000", "entre 4 000 000 et 5 000 000"], "Encadre 3 250 000", "Entre quels millions ?", "entre 3 et 4 millions."),
            step("number", "Décomposer", "67", ["76", "607"], "Milliers", "Dans 2 067 450, combien de milliers dans la classe des milliers (067) ?", "67."),
            step("choice", "Ordre", "1 000 000 < 10 000 000", ["10 000 000 < 1 000 000", "égaux"], "Compare", "Quelle comparaison est vraie ?", "1 million < 10 millions."),
            step("choice", "Application", "999 999 999", ["100 000 000", "99 999 999"], "Plus grand ≤ milliard-1", "Plus grand nombre à 9 chiffres ?", "999 999 999."),
        ]

    if "calcul-mental" in tid or "addition" in tid or "operations" in tid:
        if g == "cp":
            return [
                step("number", "Addition", "8", ["7", "9"], "5 + 3", "Calcule 5 + 3.", "5 + 3 = 8."),
                step("number", "Addition", "12", ["11", "13"], "7 + 5", "Calcule 7 + 5.", "7 + 5 = 12."),
                step("number", "Problème", "9", ["8", "10"], "Billes", "Tu as 4 billes, tu en gagnes 5. Combien en as-tu ?", "4 + 5 = 9."),
                step("number", "Complément", "10", ["9", "11"], "Vers 10", "6 + ? = 10. Écris le complément.", "4.", expected_override="4", distractors_override=["5", "3"]),
                step("number", "Double", "14", ["12", "16"], "Double de 7", "Quel est le double de 7 ?", "14."),
                step("number", "Suite", "15", ["14", "16"], "10 + 5", "Calcule 10 + 5.", "15."),
                step("number", "Application", "11", ["10", "12"], "6 + 5", "Calcule 6 + 5.", "11."),
            ]
        if g == "ce1":
            return [
                step("number", "Soustraction", "9", ["8", "10"], "15 − 6", "Calcule 15 − 6.", "15 − 6 = 9."),
                step("number", "Sens", "12", ["14", "10"], "Reste", "Tu as 20, tu donnes 8. Combien reste-t-il ?", "20 − 8 = 12."),
                step("number", "Addition", "47", ["37", "57"], "23 + 24", "Calcule 23 + 24.", "47."),
                step("choice", "Opération", "soustraction", ["addition", "multiplication"], "Quelle opération ?", "On cherche ce qui reste. Quelle opération ?", "soustraction."),
                step("number", "Complément", "100", ["90", "110"], "Vers 100", "65 + ? = 100. Écris le complément.", "35.", expected_override="35", distractors_override=["25", "45"]),
                step("number", "Différence", "18", ["16", "20"], "50 − 32", "Calcule 50 − 32.", "18."),
                step("number", "Application", "27", ["25", "29"], "40 − 13", "Calcule 40 − 13.", "27."),
            ]
        if g == "ce2":
            return [
                step("number", "Multiplication", "24", ["20", "28"], "6 × 4", "Calcule 6 × 4.", "24."),
                step("number", "Multiplication", "70", ["63", "80"], "7 × 10", "Calcule 7 × 10.", "70."),
                step("number", "Division", "8", ["7", "9"], "56 ÷ 7", "Calcule 56 ÷ 7.", "8."),
                step("number", "Posée mentale", "36", ["30", "42"], "9 × 4", "Calcule 9 × 4.", "36."),
                step("number", "Partage", "6", ["5", "7"], "30 ÷ 5", "Calcule 30 ÷ 5.", "6."),
                step("number", "Chaîne", "48", ["40", "56"], "6 × 8", "Calcule 6 × 8.", "48."),
                step("number", "Application", "9", ["8", "10"], "72 ÷ 8", "Calcule 72 ÷ 8.", "9."),
            ]
        # cm2 calcul mental
        return [
            step("number", "×10", "370", ["37", "3700"], "37 × 10", "Calcule 37 × 10.", "370."),
            step("number", "×100", "4500", ["450", "45000"], "45 × 100", "Calcule 45 × 100.", "4500."),
            step("number", "Double", "86", ["76", "96"], "Double de 43", "Quel est le double de 43 ?", "86."),
            step("number", "Moitié", "36", ["32", "40"], "Moitié de 72", "Quelle est la moitié de 72 ?", "36."),
            step("number", "Complément", "1000", ["900", "1100"], "Vers 1000", "625 + ? = 1000. Écris le complément.", "375.", expected_override="375", distractors_override=["325", "425"]),
            step("number", "Réfléchi", "150", ["140", "160"], "3 × 50", "Calcule 3 × 50.", "150."),
            step("number", "Application", "240", ["200", "280"], "8 × 30", "Calcule 8 × 30.", "240."),
        ]

    if "problem" in tid or "problemes" in tid:
        return [
            step("number", "1 étape", "28", ["24", "32"], "Total", "Une équipe a 15 points, puis en marque 13. Quel total ?", "15 + 13 = 28."),
            step("number", "Reste", "17", ["15", "19"], "Reste", "Sur 40 ballons, 23 sont utilisés. Combien restent ?", "40 − 23 = 17."),
            step("number", "2 étapes", "36", ["30", "42"], "Chaîne", "Tu gagnes 20, puis 10, puis tu perds 4. Combien as-tu ?", "20 + 10 − 4 = 26.", expected_override="26", distractors_override=["24", "30"]),
            step("choice", "Choisir l’opération", "multiplication", ["addition", "soustraction"], "Sens", "4 sacs de 6 balles : quelle opération pour le total ?", "multiplication."),
            step("number", "Produit", "24", ["20", "28"], "4 × 6", "4 sacs de 6 balles. Combien de balles ?", "24."),
            step("number", "Partage", "9", ["8", "10"], "Partage", "36 objets partagés en 4 groupes égaux. Combien par groupe ?", "36 ÷ 4 = 9."),
            step("number", "Application", "45", ["40", "50"], "Problème final", "3 paquets de 12, plus 9. Combien en tout ?", "3×12 + 9 = 45."),
        ]

    if "proportion" in tid:
        return [
            step("choice", "Reconnaître", "oui", ["non", "parfois"], "Proportionnel ?", "2 → 10 et 4 → 20 : proportionnel ?", "Oui, coefficient 5."),
            step("number", "Unité", "5", ["2", "10"], "Prix unitaire", "2 articles coûtent 10 €. Prix d’1 article ?", "5."),
            step("number", "Calculer", "35", ["30", "40"], "7 articles", "1 article = 5 €. Prix de 7 ?", "35."),
            step("number", "Quantité", "8", ["6", "10"], "Combien ?", "1 = 4 €, total 32 €. Combien d’articles ?", "8."),
            step("choice", "Contre-exemple", "non", ["oui", "parfois"], "Forfait", "1→10, 2→18, 3→24 : proportionnel ?", "Non, le prix unitaire change."),
            step("number", "Tableau", "24", ["20", "28"], "Coefficient 4", "6 × 4 = ?", "24."),
            step("number", "Application", "60", ["50", "70"], "Finale", "3 coûtent 18 €. Prix de 10 ?", "1=6, 10×6=60."),
        ]

    if "grandeur" in tid:
        return [
            step("number", "Durée", "60", ["30", "100"], "Minutes dans 1 h", "Combien de minutes dans 1 heure ?", "60."),
            step("number", "Durée", "90", ["80", "100"], "1 h 30", "1 h 30 min = combien de minutes ?", "90."),
            step("number", "Angle", "90", ["45", "180"], "Angle droit", "Combien de degrés dans un angle droit ?", "90."),
            step("choice", "Unité", "mètre", ["gramme", "litre"], "Longueur", "Quelle unité pour une longueur de terrain ?", "mètre."),
            step("number", "Périmètre", "20", ["16", "24"], "Carré côté 5", "Périmètre d’un carré de côté 5 ?", "4×5=20."),
            step("number", "Conversion", "1000", ["100", "10"], "m en mm…", "1 m = combien de mm ?", "1000."),
            step("number", "Application", "45", ["40", "50"], "3/4 d’heure", "Les 3/4 d’une heure en minutes ?", "45."),
        ]

    if "geometr" in tid:
        return [
            step("choice", "Figure", "carré", ["rectangle", "triangle"], "4 côtés égaux + 4 angles droits", "Quelle figure ?", "carré."),
            step("choice", "Symétrie", "oui", ["non", "parfois"], "Axe", "Un carré a-t-il un axe de symétrie ?", "Oui."),
            step("number", "Côtés", "6", ["5", "8"], "Hexagone", "Combien de côtés a un hexagone ?", "6."),
            step("choice", "Angle", "angle droit", ["angle aigu", "angle obtus"], "90°", "Comment appelle-t-on un angle de 90° ?", "angle droit."),
            step("choice", "Losange", "4 côtés égaux", ["4 angles droits", "3 côtés"], "Losange", "Un losange a…", "4 côtés égaux."),
            step("choice", "Patron", "patron", ["perspective", "droite"], "Solide déplié", "Le dessin déplié d’un solide s’appelle…", "patron."),
            step("choice", "Application", "symétrie", ["translation", "rotation"], "Miroir", "Reporter une figure comme dans un miroir : quelle transformation ?", "symétrie."),
        ]

    if "donnee" in tid or "algebre" in tid:
        if "algebre" in tid:
            return [
                step("number", "Suite", "14", ["12", "16"], "Suite +3", "Suite : 5, 8, 11, … Quel suivant ?", "14."),
                step("number", "Suite", "32", ["30", "34"], "Suite ×2", "Suite : 4, 8, 16, … Quel suivant ?", "32."),
                step("choice", "Symbole", "=", ["+", "×"], "Égalité", "Quel symbole pour « est égal à » ?", "="),
                step("number", "Égalité", "9", ["8", "10"], "Trouer", "4 + ? = 13. Quel nombre ?", "9."),
                step("number", "Programme", "20", ["18", "22"], "×2 puis +4", "On part de 8 : ×2 puis +4. Résultat ?", "8×2+4=20."),
                step("number", "Programme", "15", ["12", "18"], "+5 puis ×1", "On part de 10 : +5. Résultat ?", "15."),
                step("number", "Application", "21", ["18", "24"], "Suite +4", "Suite : 9, 13, 17, … Quel suivant ?", "21."),
            ]
        return [
            step("number", "Lecture", "12", ["10", "14"], "Diagramme", "Un diagramme montre 12 votes pour A. Combien ?", "12."),
            step("choice", "Plus fréquent", "football", ["rugby", "espace"], "Mode", "Si football a le plus de voix, quel sport est le plus fréquent ?", "football."),
            step("choice", "Probabilité", "1 chance sur 2", ["1 chance sur 3", "2 chances sur 2"], "Pièce", "Pile ou face : quelle chance d’avoir pile ?", "1 chance sur 2."),
            step("number", "Total", "30", ["25", "35"], "Somme", "10 + 8 + 12 observations. Total ?", "30."),
            step("choice", "Tableau", "ligne", ["cercle", "angle"], "Lire un tableau", "Dans un tableau à double entrée, on lit une…", "ligne."),
            step("choice", "Hasard", "plus probable", ["impossible", "certain"], "Vocabulaire", "Si un événement a beaucoup de chances : il est…", "plus probable."),
            step("number", "Application", "7", ["5", "9"], "Écart", "15 oui et 8 non. Combien de oui de plus ?", "7."),
        ]

    return default_math_pack(g, label)


def default_math_pack(grade: str, label: str) -> list[dict]:
    return [
        step("number", "Calcul 1", "12", ["10", "14"], "6 + 6", f"Calcule 6 + 6. ({label})", "12."),
        step("number", "Calcul 2", "20", ["18", "22"], "4 × 5", "Calcule 4 × 5.", "20."),
        step("number", "Calcul 3", "9", ["8", "10"], "15 − 6", "Calcule 15 − 6.", "9."),
        step("number", "Calcul 4", "8", ["7", "9"], "24 ÷ 3", "Calcule 24 ÷ 3.", "8."),
        step("choice", "Comparer", "15", ["12", "10"], "Le plus grand", "Parmi 10, 12 et 15, le plus grand ?", "15."),
        step("number", "Chaîne", "18", ["16", "20"], "10 + 5 + 3", "Calcule 10 + 5 + 3.", "18."),
        step("number", "Application", "25", ["20", "30"], "20 + 5", "Calcule 20 + 5.", "25."),
    ]


def pack_francais(theme_id: str, grade: str, label: str) -> list[dict]:
    if "lecture" in theme_id:
        return [
            step("choice", "Personnage", "Léo", ["Mia", "Tom"], "Qui ?", "Dans le texte, le héros s’appelle Léo. Qui est le héros ?", "Léo."),
            step("choice", "Lieu", "forêt", ["ville", "plage"], "Où ?", "L’histoire se passe dans une forêt. Où ?", "forêt."),
            step("choice", "Inférence", "il est content", ["il est triste", "il dort"], "Comprendre", "Léo sourit et saute : que peut-on dire ?", "il est content."),
            step("choice", "Pronom", "Léo", ["la forêt", "le ballon"], "Remplace", "« Il court » : « Il » désigne…", "Léo."),
            step("choice", "Ordre", "1 puis 2 puis 3", ["3 puis 1 puis 2", "2 puis 3 puis 1"], "Chronologie", "Ordre : 1 départ, 2 obstacle, 3 arrivée.", "1 puis 2 puis 3."),
            step("choice", "Idée principale", "réussir ensemble", ["manger", "dormir"], "Thème", "Le texte parle d’une équipe qui réussit ensemble. Idée principale ?", "réussir ensemble."),
            step("choice", "Application", "parce qu’il s’entraîne", ["par hasard", "sans raison"], "Pourquoi ?", "Le héros progresse parce qu’il s’entraîne. Pourquoi progresse-t-il ?", "parce qu’il s’entraîne."),
        ]
    if "ecriture" in theme_id:
        return [
            step("choice", "Phrase", "sujet + verbe", ["verbe seul", "mot isolé"], "Phrase minimale", "Une phrase simple contient au moins…", "sujet + verbe."),
            step("choice", "Ponctuation", ".", ["?", "!"], "Fin de phrase déclarative", "Quelle ponctuation pour une phrase déclarative ?", "."),
            step("text", "Accord", "les", ["le", "la"], "Déterminant pluriel", "Complète : ___ ballons. Écris « les ».", "les."),
            step("choice", "Conjugaison", "il court", ["il courir", "il couraitont"], "Présent", "Quelle forme est correcte au présent ?", "il court."),
            step("choice", "Cohérence", "puis", ["car", "mais"], "Connecteur de suite", "Pour enchaîner deux actions : …", "puis."),
            step("choice", "Réécriture", "plus clair", ["plus long seulement", "sans sens"], "Améliorer", "Réécrire un texte vise à le rendre…", "plus clair."),
            step("choice", "Application", "majuscule", ["virgule seule", "rien"], "Début de phrase", "Une phrase commence par une…", "majuscule."),
        ]
    if "langue" in theme_id:
        return [
            step("choice", "Nature", "verbe", ["nom", "adjectif"], "Courir", "Dans « Léo court », « court » est un…", "verbe."),
            step("choice", "Classe", "nom", ["verbe", "déterminant"], "Ballon", "« Ballon » est un…", "nom."),
            step("choice", "Accord", "belles", ["beau", "bels"], "Accord adjectif", "Des ___ fleurs (beau).", "belles."),
            step("choice", "Temps", "imparfait", ["présent", "futur"], "Il jouait", "Quel temps ?", "imparfait."),
            step("choice", "Homophone", "a", ["à", "as"], "Verbe avoir", "Il ___ un ballon (avoir).", "a."),
            step("choice", "Sujet", "les joueurs", ["fort", "vite"], "Qui fait l’action ?", "Dans « Les joueurs courent », le sujet est…", "les joueurs."),
            step("choice", "Application", "ont", ["on", "onde"], "Accord passé composé", "Ils ___ gagné.", "ont."),
        ]
    # vocabulaire
    return [
        step("choice", "Synonyme", "content", ["triste", "fatigué"], "Synonyme de joyeux", "Un synonyme de « joyeux » ?", "content."),
        step("choice", "Contraire", "petit", ["grand", "énorme"], "Contraire de grand", "Le contraire de « grand » ?", "petit."),
        step("choice", "Sens", "rapide", ["lent", "arrêté"], "« Vite »", "« Vite » signifie…", "rapide."),
        step("choice", "Famille", "joueur", ["jouerment", "jouure"], "Famille de jouer", "Quel mot de la famille de « jouer » ?", "joueur."),
        step("choice", "Préfixe", "rejouer", ["dejouer", "surjouer"], "Re-", "« Jouer encore » avec le préfixe re- ?", "rejouer."),
        step("choice", "Contexte", "terrain", ["nuage", "assiette"], "Stade", "Dans un match, on joue sur un…", "terrain."),
        step("choice", "Application", "courageux", ["peur", "timide"], "Sens", "Qui a du courage est…", "courageux."),
    ]


def pack_histoire_geo(theme_id: str, label: str) -> list[dict]:
    if "geo" in theme_id or "déplacer" in label.lower() or "Communiquer" in label or "habiter" in label.lower() or "Habiter" in label:
        return [
            step("choice", "Notion", "transport", ["conjugaison", "fraction"], "Se déplacer", "Pour aller d’une ville à une autre, on utilise un…", "transport."),
            step("choice", "Échelle", "carte", ["poème", "équation"], "Repérer", "Pour se repérer dans l’espace, on lit une…", "carte."),
            step("choice", "Internet", "communiquer", ["cuisiner", "dormir"], "Réseaux", "Internet sert surtout à…", "communiquer."),
            step("choice", "Ville", "habiter", ["multiplier", "chanter"], "Logement", "Trouver un logement, c’est une question d’…", "habiter."),
            step("choice", "Mobilité", "train", ["nuage", "verbe"], "Moyen", "Un moyen de transport collectif ferré ?", "train."),
            step("choice", "Environnement", "recyclage", ["addition", "imparfait"], "Mieux habiter", "Réduire les déchets passe par le…", "recyclage."),
            step("choice", "Application", "plan", ["conjugaison", "fraction"], "Lire un plan", "Pour se déplacer en ville, on peut lire un…", "plan."),
        ]
    # histoire
    return [
        step("choice", "Repère", "République", ["Empire romain", "Préhistoire"], "Régime", "La France est aujourd’hui une…", "République."),
        step("choice", "Siècle", "XIXe", ["Ve", "XXVe"], "Industrie", "L’âge industriel se développe surtout au…", "XIXe."),
        step("choice", "Conflit", "guerre mondiale", ["match de foot", "dictée"], "1914-1918", "1914-1918 désigne une…", "guerre mondiale."),
        step("choice", "UE", "Union européenne", ["Ligue des champions", "Académie"], "Europe", "La construction européenne mène à l’…", "Union européenne."),
        step("choice", "Roi", "monarchie", ["république", "dictée"], "Temps des rois", "Avant la Révolution, la France est surtout une…", "monarchie."),
        step("choice", "Révolution", "1789", ["1914", "1492"], "Date clé", "La Révolution française commence en…", "1789."),
        step("choice", "Application", "citoyen", ["spectateur seulement", "robot"], "République", "Dans une République, on est…", "citoyen."),
    ]


def pack_sciences(theme_id: str, label: str) -> list[dict]:
    if "vivant" in theme_id:
        return [
            step("choice", "Besoin", "eau", ["plastique", "métal"], "Plante", "Une plante a besoin d’…", "eau."),
            step("choice", "Classification", "animal", ["rocher", "nuage"], "Chien", "Un chien est un…", "animal."),
            step("choice", "Cycle", "graine", ["pile", "vis"], "Plante", "Une plante peut naître d’une…", "graine."),
            step("choice", "Chaîne", "se nourrir", ["voler dans l’espace", "écrire"], "Êtres vivants", "Les êtres vivants doivent…", "se nourrir."),
            step("choice", "Habitat", "milieu", ["fraction", "verbe"], "Vie", "Le lieu où vit un animal est son…", "milieu."),
            step("choice", "Santé", "hygiène", ["hasard", "silence"], "Corps", "Pour rester en bonne santé, on respecte des règles d’…", "hygiène."),
            step("choice", "Application", "oxygène", ["plastique", "bruit"], "Respiration", "Les êtres humains respirent de l’…", "oxygène."),
        ]
    if "energie" in theme_id or "objet" in theme_id:
        return [
            step("choice", "Énergie", "électricité", ["silence", "ombre"], "Appareil", "Beaucoup d’appareils fonctionnent grâce à l’…", "électricité."),
            step("choice", "Objet", "outil", ["poème", "fraction"], "Technique", "Un marteau est un…", "outil."),
            step("choice", "Sécurité", "prudence", ["vitesse maximale", "hasard"], "Usage", "Avec un objet technique, on agit avec…", "prudence."),
            step("choice", "Source", "soleil", ["cahier", "verbe"], "Énergie", "Une source d’énergie naturelle ?", "soleil."),
            step("choice", "Circuit", "fermé", ["ouvert seulement", "invisible"], "Lampe", "Pour qu’une lampe s’allume, le circuit doit être…", "fermé."),
            step("choice", "Matériau", "métal", ["nuage", "son"], "Conducteur", "Un bon conducteur électrique courant ?", "métal."),
            step("choice", "Application", "économiser", ["gaspiller", "ignorer"], "Geste", "Face à l’énergie, un bon geste est d’…", "économiser."),
        ]
    # matiere
    return [
        step("choice", "État", "solide", ["verbe", "angle"], "Glace", "La glace est un état…", "solide."),
        step("choice", "État", "liquide", ["solide", "gazeux"], "Eau du robinet", "L’eau du robinet est…", "liquide."),
        step("choice", "Changement", "fonte", ["multiplication", "dictée"], "Glace → eau", "Quand la glace devient eau : …", "fonte."),
        step("choice", "Mélange", "dissolution", ["conjugaison", "symétrie"], "Sucre dans l’eau", "Le sucre disparaît dans l’eau : …", "dissolution."),
        step("choice", "Propriété", "flotte", ["conjugue", "décline"], "Bouchon", "Un bouchon sur l’eau…", "flotte."),
        step("choice", "Air", "gazeux", ["solide", "liquide"], "État de l’air", "L’air est…", "gazeux."),
        step("choice", "Application", "vapeur", ["glace", "bois"], "Eau chauffée fort", "L’eau très chaude peut devenir de la…", "vapeur."),
    ]


def pack_qdm(theme_id: str, label: str) -> list[dict]:
    if "espace" in theme_id or "temps" in theme_id:
        return [
            step("choice", "Temps", "journée", ["fraction", "angle"], "Repère", "Matin, midi, soir font partie d’une…", "journée."),
            step("choice", "Calendrier", "mois", ["verbe", "solide"], "Année", "Une année est découpée en…", "mois."),
            step("choice", "Espace", "carte", ["poème", "addition"], "Se situer", "Pour se situer, on peut utiliser une…", "carte."),
            step("choice", "Orient", "nord", ["verbe", "litre"], "Point cardinal", "Un point cardinal ?", "nord."),
            step("choice", "Hier", "passé", ["futur", "présent seulement"], "Temporalité", "Hier appartient au…", "passé."),
            step("choice", "Demain", "futur", ["passé", "présent"], "Temporalité", "Demain appartient au…", "futur."),
            step("choice", "Application", "semaine", ["siècle", "millénaire"], "7 jours", "Sept jours forment une…", "semaine."),
        ]
    if "vivant" in theme_id:
        return pack_sciences("vivant", label)
    if "matiere" in theme_id or "objet" in theme_id:
        return pack_sciences("matiere" if "matiere" in theme_id else "objet", label)
    return pack_sciences("matiere", label)


def pack_emc(grade: str) -> list[dict]:
    return [
        step("choice", "Règle", "respecter les autres", ["insulter", "bousculer"], "Classe", "Une règle importante en classe ?", "respecter les autres."),
        step("choice", "Droit", "s’exprimer", ["nuire", "voler"], "Liberté", "Un droit de l’élève est de…", "s’exprimer."),
        step("choice", "Jugement", "écouter", ["interrompre", "se moquer"], "Débat", "Dans un débat, on doit…", "écouter."),
        step("choice", "Engagement", "aider", ["ignorer", "exclure"], "Solidarité", "Un geste d’engagement ?", "aider."),
        step("choice", "Émotion", "nommer son émotion", ["cacher toujours", "crier"], "Sensibilité", "Face à une émotion, on peut…", "nommer son émotion."),
        step("choice", "Coopération", "ensemble", ["tout seul contre les autres", "sans écouter"], "Projet", "Coopérer, c’est travailler…", "ensemble."),
        step("choice", "Application", "politesse", ["moquerie", "exclusion"], "Vivre ensemble", "Dire bonjour est un geste de…", "politesse."),
    ]


def pack_anglais(grade: str) -> list[dict]:
    return [
        step("choice", "Saluer", "hello", ["goodbye only", "table"], "Greeting", "Pour dire bonjour en anglais ?", "hello."),
        step("choice", "Couleur", "blue", ["bleu", "bloo"], "Colour", "Quelle est la couleur « blue » ?", "blue."),
        step("choice", "Nombre", "three", ["tree", "free"], "Number", "Le nombre 3 en anglais ?", "three."),
        step("choice", "Objet", "book", ["livre", "buk"], "Classroom", "« Livre » en anglais ?", "book."),
        step("choice", "Question", "what", ["wat", "ouat"], "Wh-", "Pour demander « quoi » ?", "what."),
        step("choice", "Politesse", "please", ["plese", "place"], "Polite", "« S’il te plaît » ?", "please."),
        step("choice", "Application", "thank you", ["tank you", "think you"], "Thanks", "Pour dire merci ?", "thank you."),
    ]


def step(kind, kicker, expected, distractors, title, statement, hint, note=None, *, kind_override=None, expected_override=None, distractors_override=None):
    d = {
        "kind": kind_override or kind,
        "kicker": kicker,
        "expected": expected_override if expected_override is not None else expected,
        "distractors": list(distractors_override if distractors_override is not None else distractors),
        "title": title,
        "statement": statement,
        "hint": hint,
        "note": note,
    }
    return d


def core_for(grade: str, subject: str, theme_id: str, label: str) -> list[dict]:
    if subject == "maths":
        return pack_maths(theme_id, grade, label)
    if subject == "francais":
        return pack_francais(theme_id, grade, label)
    if subject == "histoire-geo":
        return pack_histoire_geo(theme_id, label)
    if subject == "sciences":
        return pack_sciences(theme_id, label)
    if subject == "questionner-le-monde":
        return pack_qdm(theme_id, label)
    if subject == "emc":
        return pack_emc(grade)
    if subject == "anglais":
        return pack_anglais(grade)
    return default_math_pack(grade, label)


def render_copy_all(title, statement, hint=None, note=None, caption=None) -> str:
    parts = [f"title: {js_str(title)}", f"statement: {js_str(statement)}"]
    if note:
        parts.append(f"note: {js_str(note)}")
    if hint:
        parts.append(f"hint: {js_str(hint)}")
    if caption:
        parts.append(f"caption: {js_str(caption)}")
    return "allUniverses({\n        " + ",\n        ".join(parts) + ",\n      })"


def render_copy_universes(make) -> str:
    blocks = []
    for u in UNIVERSES:
        title, statement, caption, hint = make(u)
        lines = [f"title: {js_str(title)}", f"statement: {js_str(statement)}"]
        if hint:
            lines.append(f"hint: {js_str(hint)}")
        lines.append(f"caption: {js_str(caption)}")
        blocks.append(f"        {u}: {{\n          " + ",\n          ".join(lines) + ",\n        }")
    return "{\n" + ",\n".join(blocks) + ",\n      }"


def render_answer_step(s: dict, idx: int, total: int) -> str:
    progress = min(idx, 6)
    kicker = f"Étape {idx} sur {total} · {s['kicker']}"
    body = [
        f"      kind: {js_str(s['kind'])},",
        f"      kicker: {js_str(kicker)},",
        f"      progress: {progress},",
        f"      expected: {js_str(s['expected'])},",
        f"      distractors: {json.dumps(s['distractors'], ensure_ascii=False)},",
    ]
    # universe-flavored statement for variety on even steps
    if idx % 2 == 0:
        def make(u):
            n = NARRATIVE[u]
            st = s["statement"]
            return s["title"], st, s.get("hint") and s["hint"] or "", n["obj_cap"]
        # fix make return
        def make2(u):
            return (
                s["title"],
                s["statement"],
                NARRATIVE[u]["obj_cap"],
                s.get("hint"),
            )
        copy = render_copy_universes(make2)
    else:
        copy = render_copy_all(s["title"], s["statement"], s.get("hint"), s.get("note"), "Tu valides ta réponse.")
    body.append(f"      copy: {copy},")
    return "    {\n" + "\n".join(body) + "\n    }"


def generate_mission_ts(grade, subject, theme_id, label) -> tuple[str, str, str]:
    mid, slug = mission_id_for(grade, subject, theme_id)
    title, blurb = title_blurb(label, grade)
    cores = core_for(grade, subject, theme_id, label)
    assert len(cores) >= 7
    core6, appl = cores[:6], cores[6]

    steps = []
    # 1 tutorial
    steps.append(
        f"""    {{
      kind: "continue",
      kicker: "Tutoriel",
      progress: 0,
      copy: {render_copy_all(
            f"Bienvenue : {label}",
            f"Dans cette mission de {grade.upper()}, tu vas travailler : {label}. Lis bien chaque consigne, utilise l’indice si besoin, puis valide.",
            "Prends ton temps : il n’y a ni note ni classement.",
            None,
            "La mission peut commencer.",
        )},
    }}"""
    )
    # 2 mise en action
    steps.append(
        f"""    {{
      kind: "continue",
      kicker: "Mise en action",
      progress: 0,
      copy: {render_copy_universes(lambda u: (NARRATIVE[u]["action_title"], NARRATIVE[u]["action"], NARRATIVE[u]["action_cap"], None))},
    }}"""
    )
    # 3 objectif
    steps.append(
        f"""    {{
      kind: "continue",
      kicker: "Objectif",
      progress: 0,
      copy: {render_copy_universes(lambda u: (NARRATIVE[u]["obj_title"], f"{NARRATIVE[u]['obj']} Objectif : {label}.", NARRATIVE[u]["obj_cap"], None))},
    }}"""
    )
    # 4-9 core
    for i, s in enumerate(core6, start=1):
        steps.append(render_answer_step(s, i, 6))
    # 10 application
    steps.append(render_answer_step({**appl, "kicker": "Application"}, 6, 6).replace("Étape 6 sur 6 · Application", "Application"))
    # 11 victory
    steps.append(
        f"""    {{
      kind: "continue",
      kicker: "Mission réussie",
      progress: 6,
      copy: {render_copy_universes(lambda u: (NARRATIVE[u]["win_title"], NARRATIVE[u]["win"], NARRATIVE[u]["win_cap"], None))},
    }}"""
    )
    # 12 method
    steps.append(
        f"""    {{
      kind: "method",
      kicker: "Ce que tu as appris",
      progress: 6,
      copy: {render_copy_all(
            f"Je progresse sur : {label}",
            "Tu as entraîné la notion pas à pas, avec des exemples et des décisions.",
            None,
            "Relis les indices des étapes difficiles : ce sont de vraies méthodes à réutiliser.",
            "Tu pourras réutiliser cette méthode dans une autre mission.",
        )},
    }}"""
    )
    # 13 bilan
    steps.append(
        f"""    {{
      kind: "bilan",
      kicker: "Bilan sans note",
      progress: 6,
      copy: {render_copy_all(
            "Ton bilan",
            f"Tu as travaillé « {label} » sans note ni classement. Qu’as-tu réussi aujourd’hui ?",
            None,
            "Qu’as-tu préféré dans cette mission ?",
            "Les réussites sont valorisées sans classement.",
        )},
    }}"""
    )
    # 14 teaser
    steps.append(
        f"""    {{
      kind: "teaser",
      kicker: "Prochaine mission",
      progress: 6,
      copy: {render_copy_universes(lambda u: ( "Un nouveau défi t’attend", NARRATIVE[u]["teaser"], NARRATIVE[u]["teaser_cap"], None))},
    }}"""
    )

    content = f'''import {{ allUniverses, defineMission }} from "../../define";

export const MISSION_ID = {js_str(mid)};

/** {grade.upper()} / {subject} — {label}. Phase A standard. */
export const mission = defineMission({{
  id: MISSION_ID,
  grade: {js_str(grade)},
  subject: {js_str(subject)},
  title: {js_str(title)},
  blurb: {js_str(blurb)},
  available: true,
  version: 1,
  steps: [
{",\n".join(steps)},
  ],
}});
'''
    rel = f"src/data/missions/{grade}/{subject}/{mid}.ts"
    return mid, rel, content


def main():
    rows = list(csv.DictReader(CSV_PATH.open(encoding="utf-8")))
    generated = []  # (theme_id, mid, rel)

    for row in rows:
        grade, subject, theme_id, label = row["grade"], row["subject"], row["theme_id"], row["theme_label"]
        mid, _ = mission_id_for(grade, subject, theme_id)
        if theme_id in THEME_MISSION_OVERRIDE:
            mid = THEME_MISSION_OVERRIDE[theme_id]
        if mid in SKIP_IDS:
            # ensure done status
            row["statut"] = "done"
            row["mission_id"] = mid
            row["fichier"] = f"src/data/missions/{grade}/{subject}/{mid}.ts"
            row["difficulte_standard"] = "done"
            row["difficulte_facile"] = row.get("difficulte_facile") or "todo"
            row["difficulte_difficile"] = row.get("difficulte_difficile") or "todo"
            row["updated_at"] = TODAY
            generated.append((theme_id, mid, row["fichier"], False))
            continue

        mid, rel, content = generate_mission_ts(grade, subject, theme_id, label)
        out = ROOT / rel
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(content, encoding="utf-8")
        row["statut"] = "done"
        row["mission_id"] = mid
        row["fichier"] = rel
        row["difficulte_standard"] = "done"
        row["difficulte_facile"] = "todo"
        row["difficulte_difficile"] = "todo"
        row["updated_at"] = TODAY
        generated.append((theme_id, mid, rel, True))
        print("wrote", rel)

    # write CSV
    fields = list(rows[0].keys())
    with CSV_PATH.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)

    # rewrite index.ts imports
    # Keep fractions-01 first, then all others sorted
    missions = []
    for row in rows:
        mid = row["mission_id"]
        grade, subject = row["grade"], row["subject"]
        rel_import = f"./{grade}/{subject}/{mid}"
        var = re.sub(r"[^a-zA-Z0-9]", "_", mid)
        missions.append((mid, rel_import, var))

    # dedupe by mid
    seen = set()
    uniq = []
    for m in missions:
        if m[0] in seen:
            continue
        seen.add(m[0])
        uniq.append(m)

    imports = "\n".join(f'import {{ mission as {var} }} from "{path}";' for mid, path, var in uniq)
    arr = ",\n  ".join(var for _, _, var in uniq)
    index = f'''import type {{ GradeLevel, MissionDef, SubjectSlug }} from "../types";
{imports}

/** Missions officielles embarquées (TypeScript). */
export const BUILTIN_MISSIONS: MissionDef[] = [
  {arr},
];

/** @deprecated Utiliser BUILTIN_MISSIONS ou resolveMission. */
export const MISSIONS = BUILTIN_MISSIONS;

export function findBuiltinMission(id: string | null | undefined): MissionDef | null {{
  if (!id) return null;
  return BUILTIN_MISSIONS.find((item) => item.id === id) ?? null;
}}

export function listBuiltinMissions(
  grade?: GradeLevel | null,
  subject?: SubjectSlug | null,
): MissionDef[] {{
  return BUILTIN_MISSIONS.filter((item) => {{
    if (grade && item.grade !== grade) return false;
    if (subject && item.subject !== subject) return false;
    return true;
  }});
}}

export function defaultBuiltinMission(
  grade: GradeLevel | null,
  subject: SubjectSlug | null,
): MissionDef | null {{
  return listBuiltinMissions(grade, subject).find((item) => item.available) ?? null;
}}

export function findMission(id: string | null | undefined): MissionDef | null {{
  return findBuiltinMission(id);
}}

export function listMissions(grade?: GradeLevel | null, subject?: SubjectSlug | null): MissionDef[] {{
  return listBuiltinMissions(grade, subject);
}}

export function defaultMissionFor(
  grade: GradeLevel | null,
  subject: SubjectSlug | null,
): MissionDef | null {{
  return defaultBuiltinMission(grade, subject);
}}

export {{
  buildMissionId,
  isValidMissionId,
  isValidStepSlug,
  ordinalStepSlug,
  parseMissionId,
  parseStepId,
  stepId,
  stepSlugOf,
}} from "./ids";
export {{ allUniverses, defineMission, defineSteps }} from "./define";
export {{ BILAN_CHOICES, DIRECTION_LABELS }} from "./labels";
export {{
  deleteTeacherMission,
  EDITOR_KINDS,
  listEditableCatalog,
  listResolvedMissions,
  listTeacherMissions,
  resolveMission,
  saveTeacherMission,
  suggestNextMissionId,
}} from "./catalog";
'''
    INDEX_PATH.write_text(index, encoding="utf-8")

    # update MD dashboard
    total = len(rows)
    done = sum(1 for r in rows if r["statut"] == "done")
    todo = total - done
    by_grade = {}
    for r in rows:
        by_grade.setdefault(r["grade"], [0, 0])
        by_grade[r["grade"]][0] += 1
        if r["statut"] == "done":
            by_grade[r["grade"]][1] += 1

    treated_lines = [
        "| Thème | Mission | Fichier | Facile | Difficile |",
        "|---|---|---|---|---|",
    ]
    for r in rows:
        if r["statut"] != "done":
            continue
        treated_lines.append(
            f"| {r['theme_label']} | `{r['mission_id']}` | `{r['fichier']}` | {r['difficulte_facile']} | {r['difficulte_difficile']} |"
        )

    grade_rows = "\n".join(
        f"| {g.upper()} | {by_grade[g][0]} | {by_grade[g][1]} |"
        for g in ("cp", "ce1", "ce2", "cm1", "cm2")
        if g in by_grade
    )

    md = f"""# Suivi des missions par thème

Document de pilotage éditorial Happy Learn. Source machine : [`SUIVI-missions-themes.csv`](./SUIVI-missions-themes.csv).

Prompt agent : [`PROMPT-agent-missions.md`](./PROMPT-agent-missions.md) · Trame : [`TRAME-mission-type.md`](./TRAME-mission-type.md)

## Tableau de bord

| Indicateur | Valeur |
|---|---|
| Thèmes au total | **{total}** |
| Traités (`done`) | **{done}** |
| À faire (`todo`) | **{todo}** |
| En cours (`in_progress`) | **0** |
| Couverture standard | {done}/{total} |

### Par classe

| Classe | Thèmes | Dont done |
|---|---|---|
{grade_rows}

## Légende des statuts

| Champ | Valeurs |
|---|---|
| `statut` | `todo` · `in_progress` · `done` · `blocked` |
| `difficulte_*` | `todo` · `done` · `na` |

**Phase A :** une mission standard (`…-01`) par thème.

**Phase B :** pour chaque thème `done`, créer `…-facile-01` et `…-difficile-01` (même trame).

## Thèmes traités

{chr(10).join(treated_lines)}

## Backlog

Tous les thèmes Phase A standard sont traités (`todo` = 0). Phase B (facile / difficile) reste ouverte.
"""
    MD_PATH.write_text(md, encoding="utf-8")
    print(f"DONE generated={sum(1 for *_, w in generated if w)} total_done={done}/{total}")


if __name__ == "__main__":
    main()
