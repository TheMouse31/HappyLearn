import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Shell } from "../components/Shell";
import { StatusBadge } from "../components/StatusBadge";
import { GRADES, gradeLabel } from "../data/catalog";
import type { ChildSession, EleveFoyer, GradeLevel, StoredAnswer } from "../data/types";
import { formatStudentName } from "../data/types";
import {
  addEleveFoyer,
  listElevesFoyer,
  listSessionsByFoyerId,
  regenerateFoyerCode,
  removeEleveFoyer,
  updateEleveFoyerPin,
} from "../lib/familyStore";
import { useSession } from "../lib/session";
import { abonnementLabel, isAbonnementActive } from "../lib/subscription";
import { buildStudentStats, activityStatusLabel } from "../lib/studentStats";
import { createPersistence } from "../lib/persistence";

export function ParentSpaceScreen() {
  const {
    role,
    teacher,
    foyer,
    abonnement,
    premiumActive,
    refreshAbonnement,
    setFoyerState,
  } = useSession();
  const [eleves, setEleves] = useState<EleveFoyer[]>([]);
  const [sessions, setSessions] = useState<ChildSession[]>([]);
  const [answers, setAnswers] = useState<StoredAnswer[]>([]);
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [pin, setPin] = useState("");
  const [niveau, setNiveau] = useState<GradeLevel>("cm2");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const [foyerCode, setFoyerCode] = useState(foyer?.code ?? "");

  const reload = useCallback(async () => {
    if (!foyer) return;
    const kids = await listElevesFoyer(foyer.id);
    setEleves(kids);
    setFoyerCode(foyer.code);
    const sess = await listSessionsByFoyerId(foyer.id);
    setSessions(sess);
    const store = await createPersistence();
    const ans = await store.listAnswersBySessionIds(sess.map((s) => s.id));
    setAnswers(ans);
  }, [foyer]);

  useEffect(() => {
    void refreshAbonnement();
  }, [refreshAbonnement]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const roster = useMemo(
    () =>
      eleves.map((e) => ({
        id: e.id,
        classId: foyer?.id ?? "",
        prenom: e.prenom,
        nom: e.nom,
      })),
    [eleves, foyer?.id],
  );

  const stats = useMemo(() => {
    // Map eleve_foyer_id onto eleveId for reuse of school stats builder.
    const mapped = sessions.map((s) => ({
      ...s,
      eleveId: s.eleveFoyerId ?? s.eleveId ?? null,
    }));
    return buildStudentStats(mapped, answers, roster);
  }, [sessions, answers, roster]);

  if (role !== "parent" || !teacher) {
    return <Navigate to="/connexion/parent" replace />;
  }
  if (!premiumActive) {
    return <Navigate to="/abonnement" replace />;
  }
  if (!foyer) {
    return (
      <Shell brand="Happy Learn" stepLabel="Parent">
        <p>Préparation du foyer…</p>
      </Shell>
    );
  }

  return (
    <Shell brand="Happy Learn" stepLabel="Mon foyer" homeTo="/espace-parent" backTo="/espace-parent">
      <section className="teacher-space suivi-classe dedicated-page">
        <header className="dedicated-page-header space-hub-header">
          <div>
            <span className="kicker">Espace parent</span>
            <h1>{foyer.nom}</h1>
            <p className="suivi-greeting">Famille · {teacher.email}</p>
            <p className="field-help">
              Code foyer : <strong>{foyerCode}</strong>{" "}
              <Button
                type="button"
                onClick={() => {
                  setBusy(true);
                  void regenerateFoyerCode(foyer.id, teacher.id).then((next) => {
                    setBusy(false);
                    if (next) {
                      setFoyerCode(next.code);
                      setFoyerState(next);
                      setInfo("Nouveau code foyer généré.");
                    }
                  });
                }}
                disabled={busy}
              >
                Régénérer
              </Button>
            </p>
            <p className="field-help">
              Les enfants se connectent avec ce code + leur PIN (4 chiffres).
            </p>
          </div>
        </header>

        <div className="suivi-summary" aria-label="Synthèse foyer">
          <div className="suivi-summary-item">
            <span className="suivi-summary-value">{eleves.length}</span>
            <span className="suivi-summary-label">Enfants</span>
          </div>
          <div className="suivi-summary-item">
            <span className="suivi-summary-value suivi-summary-badge-wrap">
              <StatusBadge tone={isAbonnementActive(abonnement) ? "premium" : "free"} icon="✦">
                {isAbonnementActive(abonnement) ? "Premium" : "—"}
              </StatusBadge>
            </span>
            <span className="suivi-summary-label">{abonnementLabel(abonnement)}</span>
          </div>
          <div className="suivi-summary-item">
            <span className="suivi-summary-value">{sessions.length}</span>
            <span className="suivi-summary-label">Séances</span>
          </div>
        </div>

        <section className="suivi-panel">
          <h2>Abonnement</h2>
          <p className="field-help">
            Statut : {abonnementLabel(abonnement)}. Gestion complète sur la page dédiée.
          </p>
          <Link className="text-link" to="/abonnement">
            Gérer l’abonnement →
          </Link>
        </section>

        <section className="suivi-panel">
          <h2>Enfants</h2>
          <ul className="suivi-eleve-list">
            {eleves.map((child) => (
              <li key={child.id}>
                <strong>{formatStudentName(child.prenom, child.nom)}</strong>
                {child.niveau ? ` · ${gradeLabel(child.niveau)}` : ""}
                <div className="actions">
                  <Button
                    type="button"
                    onClick={() => {
                      const nextPin = window.prompt("Nouveau PIN (4 chiffres)", "1234");
                      if (!nextPin) return;
                      void updateEleveFoyerPin(child.id, nextPin).then((err) => {
                        if (err) setError(err);
                        else setInfo(`PIN mis à jour pour ${child.prenom}.`);
                      });
                    }}
                  >
                    Changer PIN
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      if (!window.confirm(`Retirer ${child.prenom} ?`)) return;
                      void removeEleveFoyer(child.id).then(() => reload());
                    }}
                  >
                    Retirer
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          <form
            className="login-form"
            onSubmit={(event) => {
              event.preventDefault();
              setBusy(true);
              setError("");
              void addEleveFoyer(foyer.id, prenom, nom, pin, niveau).then((result) => {
                setBusy(false);
                if (typeof result === "string") setError(result);
                else {
                  setPrenom("");
                  setNom("");
                  setPin("");
                  setInfo(`${result.prenom} ajouté·e.`);
                  void reload();
                }
              });
            }}
          >
            <h3>Ajouter un enfant</h3>
            <div className="field">
              <label htmlFor="child-prenom">Prénom</label>
              <input id="child-prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="child-nom">Nom</label>
              <input id="child-nom" value={nom} onChange={(e) => setNom(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="child-pin">PIN (4 chiffres)</label>
              <input
                id="child-pin"
                inputMode="numeric"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              />
            </div>
            <div className="field">
              <label htmlFor="child-niveau">Niveau</label>
              <select
                id="child-niveau"
                value={niveau}
                onChange={(e) => setNiveau(e.target.value as GradeLevel)}
              >
                {GRADES.map((g) => (
                  <option key={g.slug} value={g.slug}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>
            <Button variant="primary" type="submit" disabled={busy}>
              Ajouter
            </Button>
          </form>
          <p className="error">{error}</p>
          <p className="feedback info">{info}</p>
        </section>

        <section className="suivi-panel">
          <h2>Progression</h2>
          {stats.length === 0 ? (
            <p className="field-help">Pas encore de séances à la maison.</p>
          ) : (
            <ul className="suivi-eleve-list">
              {stats.map((student) => (
                <li key={student.key}>
                  <strong>{student.displayName}</strong> ·{" "}
                  {activityStatusLabel(student.activityStatus)} · {student.missionsCompleted} mission
                  {student.missionsCompleted > 1 ? "s" : ""} ·{" "}
                  {student.successRate === null ? "—" : `${student.successRate} %`}
                </li>
              ))}
            </ul>
          )}
        </section>

        <p>
          <Link className="text-link" to="/connexion/eleve">
            Écran connexion enfant →
          </Link>
        </p>
      </section>
    </Shell>
  );
}
