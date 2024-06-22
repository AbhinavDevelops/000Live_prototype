import spacy
from transformers import pipeline

# Load the transformer-based spaCy model
nlp = spacy.load("en_core_web_trf")

# Load the BART summarization model
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# Example text
text = """
I need help urgently. I am stuck in an elevator at the Hilton Hotel, New York. 
I have been here for over 3 hours and am feeling claustrophobic and very scared. 
My phone battery is low, and I can't call anyone. Please send help as soon as possible.

"""

# Process the text with spaCy
doc = nlp(text)

# Extract entities using spaCy
entities = []
for ent in doc.ents:
    entities.append(f"{ent.text}: {ent.label_}")

# Use dependency parsing to find contextually important information
important_info = []
for token in doc:
    if token.dep_ in ["nsubj", "dobj", "pobj"]:
        important_info.append(f"{token.text}: {token.dep_}")

# Summarize the text using BART
summary = summarizer(text, max_length=50, min_length=25, do_sample=False)

# Combine entities, important info, and summary
results = entities + important_info + \
    [f"Summary: {summary[0]['summary_text']}"]

# Print the results
for result in results:
    print(result)
