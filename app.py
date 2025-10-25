import streamlit as st
import json
from datetime import datetime

st.set_page_config(page_title="Collecteur de tâches brutes", page_icon="🧠", layout="wide")

st.title("🧠 Collecteur de tâches brutes")
st.caption("Saisis ici toutes tes idées ou tâches, même mal formulées. Rien n’est perdu.")

# --- Initialisation de la session ---
if "tasks" not in st.session_state:
    st.session_state.tasks = []

# --- Zone centrale (input) ---
st.markdown("### 💬 Nouvelle tâche")
new_task = st.text_input(" ", placeholder="Ex : appeler le fournisseur, refaire le doc, etc.")

if st.button("Ajouter la tâche ➕", use_container_width=True):
    if new_task.strip() != "":
        st.session_state.tasks.append({
            "tâche": new_task.strip(),
            "ajoutée_le": datetime.now().isoformat()
        })
        st.success("Tâche ajoutée ✅")
    else:
        st.warning("Entre quelque chose avant d’ajouter.")

# --- BARRE LATÉRALE ---
with st.sidebar:
    st.header("🗂️ Tableau de bord")
    st.caption("Vue d’ensemble de toutes les tâches ajoutées.")

    # Boutons à droite
    if st.button("📦 Archiver toutes les tâches"):
        if st.session_state.tasks:
            filename = f"taches_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            data = json.dumps(st.session_state.tasks, indent=2, ensure_ascii=False)
            st.download_button(
                label="⬇️ Télécharger JSON",
                data=data,
                file_name=filename,
                mime="application/json"
            )
        else:
            st.info("Aucune tâche à archiver pour le moment.")

    st.divider()
    st.subheader("📝 Liste actuelle")

    if st.session_state.tasks:
        for i, t in enumerate(st.session_state.tasks[::-1], 1):
            st.write(f"**{i}.** {t['tâche']}")
            st.caption(f"Ajoutée le {t['ajoutée_le'].split('T')[0]}")
            st.markdown("---")
    else:
        st.write("_Aucune tâche enregistrée._")
