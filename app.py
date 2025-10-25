import streamlit as st
import json
from datetime import datetime

st.set_page_config(page_title="Collecteur de tâches brutes", page_icon="🧠", layout="centered")

st.title("🧠 Collecteur de tâches brutes")
st.caption("Ajoute ici toutes tes idées ou tâches, même mal formulées. Rien n’est perdu.")

# Initialisation de la liste des tâches
if "tasks" not in st.session_state:
    st.session_state.tasks = []

# Champ de saisie
new_task = st.text_input("Nouvelle tâche", placeholder="Ex: faire un mail au client, revoir le doc, etc.")

col1, col2 = st.columns([1, 1])

# Bouton Ajouter
with col1:
    if st.button("➕ Ajouter"):
        if new_task.strip() != "":
            st.session_state.tasks.append({"tâche": new_task.strip(), "ajoutée_le": datetime.now().isoformat()})
            st.success("Tâche ajoutée ✅")
        else:
            st.warning("Tu dois entrer quelque chose avant d’ajouter.")

# Bouton Archiver
with col2:
    if st.button("📦 Archiver"):
        if st.session_state.tasks:
            filename = f"taches_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            data = json.dumps(st.session_state.tasks, indent=2, ensure_ascii=False)
            st.download_button(
                label="Télécharger les tâches en JSON",
                data=data,
                file_name=filename,
                mime="application/json"
            )
        else:
            st.info("Aucune tâche à archiver pour le moment.")

st.divider()

# Affichage des tâches
st.subheader("🗂️ Liste actuelle des tâches")
if st.session_state.tasks:
    for i, t in enumerate(st.session_state.tasks[::-1], 1):
        st.write(f"**{i}.** {t['tâche']} *(ajoutée le {t['ajoutée_le'].split('T')[0]})*")
else:
    st.write("_Aucune tâche pour le moment._")
