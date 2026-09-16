import { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Neo } from "../components/Neo";
import { Shell } from "../components/Shell";
import {
  GRADES,
  SUBJECTS,
  findOffer,
  gradeLabel,
  isCoursePlayable,
  subjectLabel,
} from "../data/catalog";
import type { GradeLevel, SubjectSlug } from "../data/types";
import { useSession } from "../lib/session";

export function CourseScreen() {
  const navigate = useNavigate();
  const { prenom, role, grade, subject, setCourse } = useSession();
  const [pickedGrade, setPickedGrade] = useState<GradeLevel | null>(grade);
  const [pickedSubject, setPickedSubject] = useState<SubjectSlug | null>(subject);
  const [error, setError] = useState("");

  const offer = useMemo(() => findOffer(pickedGrade, pickedSubject), [pickedGrade, pickedSubject]);
  const playable = isCoursePlayable(pickedGrade, pickedSubject);

  if (role === "enseignant") return <Navigate to="/espace-professeur" replace />;
  if (!prenom) return <Navigate to="/connexion/eleve" replace />;

  return (
    <Shell brand="Happy Learn" stepLabel="Classe et matière" backTo="/accueil" showSetupSteps>
      <div className="split course-layout">
        <aside className="mascot-stage">
          <p className="bubble">
            {playable
              ? "Super choix ! On peut commencer la mission."
              : "Choisis ta classe et ta matière. Happy Learn couvre tout le primaire — certaines séances arrivent bientôt."}
          </p>
          <Neo pose="guide" />
        </aside>
        <section>
          <span className="kicker">Happy Learn</span>
          <h1>Quelle est ta classe, {prenom} ?</h1>
          <p className="lead" data-listen>
            Indique ton niveau, puis la matière. Toutes les matières du primaire sont listées. Aujourd’hui, le premier
            parcours ouvert est mathématiques CM2 — les autres arrivent bientôt.
          </p>

          <h2 className="section-title">Niveau</h2>
          <div className="chip-grid" role="group" aria-label="Niveau de classe">
            {GRADES.map((item) => (
              <button
                key={item.slug}
                type="button"
                className={`chip ${pickedGrade === item.slug ? "is-selected" : ""}`}
                aria-pressed={pickedGrade === item.slug}
                onClick={() => {
                  setPickedGrade(item.slug);
                  setError("");
                }}
              >
                <strong>{item.label}</strong>
                <small>{item.cycle}</small>
              </button>
            ))}
          </div>

          <h2 className="section-title">Matière</h2>
          <div className="chip-grid subjects" role="group" aria-label="Matière">
            {SUBJECTS.map((item) => (
              <button
                key={item.slug}
                type="button"
                className={`chip ${pickedSubject === item.slug ? "is-selected" : ""}`}
                aria-pressed={pickedSubject === item.slug}
                onClick={() => {
                  setPickedSubject(item.slug);
                  setError("");
                }}
              >
                <strong>{item.label}</strong>
                <small>{item.blurb}</small>
              </button>
            ))}
          </div>

          {pickedGrade && pickedSubject ? (
            <div className={`course-status ${playable ? "is-ready" : "is-soon"}`} role="status" aria-live="polite">
              {playable && offer ? (
                <>
                  <strong>
                    {gradeLabel(pickedGrade)} · {subjectLabel(pickedSubject)}
                  </strong>
                  <p>{offer.title} — {offer.blurb}</p>
                </>
              ) : (
                <>
                  <strong>
                    {gradeLabel(pickedGrade)} · {subjectLabel(pickedSubject)}
                  </strong>
                  <p>
                    Bientôt disponible. Happy Learn accueillera toutes les matières ; pour jouer maintenant, choisis{" "}
                    <strong>CM2</strong> et <strong>Mathématiques</strong>.
                  </p>
                </>
              )}
            </div>
          ) : null}

          <p className="error" aria-live="polite">
            {error}
          </p>

          <div className="actions">
            <Button
              variant="primary"
              onClick={() => {
                if (!pickedGrade || !pickedSubject) {
                  setError("Choisis d’abord un niveau et une matière.");
                  return;
                }
                setCourse(pickedGrade, pickedSubject);
                if (!isCoursePlayable(pickedGrade, pickedSubject)) {
                  setError("Ce parcours arrive bientôt. Choisis CM2 et Mathématiques pour jouer maintenant.");
                  return;
                }
                navigate("/seance");
              }}
            >
              Continuer
            </Button>
          </div>
        </section>
      </div>
    </Shell>
  );
}
