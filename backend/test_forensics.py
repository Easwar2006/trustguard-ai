import sys
import os
import io
import numpy as np
import scipy.io.wavfile

sys.path.insert(0, os.path.abspath("backend"))
from main import decode_audio, decode_text

# ========================
# 1. TEXT TESTS
# ========================
ai_text = """In today's ever-evolving digital tapestry, artificial intelligence plays a pivotal role in modern technology. Furthermore, as organizations delve deeper into automated workflows, cybersecurity becomes a crucial element. Moreover, it is a testament to human innovation that multifaceted algorithms can foster resilience seamlessly. In conclusion, the realm of neural architectures will continue to underscore our paramount technological advancements."""

human_text = """Hey dude, so I checked out that website you sent yesterday. Honestly, idk what they were thinking with that redesign lol! It is kinda confusing to navigate tbh. Anyway, call me when you get a chance, we gotta figure out what we are doing for lunch."""

short_text = "Hello world, quick message."

res_ai_text = decode_text(ai_text)
print("AI Text overallRisk:", res_ai_text["overallRisk"], "label:", res_ai_text["label"])
assert 84 <= res_ai_text["overallRisk"] <= 93, f"Expected 84-93, got {res_ai_text['overallRisk']}"
assert res_ai_text["label"] == "AI-GENERATED SYNTHETIC TEXT"
assert len(res_ai_text["breakdown"]) == 3
print("AI breakdown:", res_ai_text["breakdown"])

res_human_text = decode_text(human_text)
print("Human Text overallRisk:", res_human_text["overallRisk"], "label:", res_human_text["label"])
assert 10 <= res_human_text["overallRisk"] <= 20, f"Expected 10-20, got {res_human_text['overallRisk']}"
assert res_human_text["label"] == "AUTHENTIC / HUMAN-WRITTEN TEXT"
assert len(res_human_text["breakdown"]) == 2
print("Human breakdown:", res_human_text["breakdown"])

res_short_text = decode_text(short_text)
print("Short Text overallRisk:", res_short_text["overallRisk"], "label:", res_short_text["label"])
assert 10 <= res_short_text["overallRisk"] <= 20
assert res_short_text["label"] == "AUTHENTIC / HUMAN-WRITTEN TEXT"

# ========================
# 2. AUDIO TESTS
# ========================
def make_wav_bytes(signal, sr=16000):
    buf = io.BytesIO()
    int_sig = np.clip(signal * 32767, -32768, 32767).astype(np.int16)
    scipy.io.wavfile.write(buf, sr, int_sig)
    return buf.getvalue()

sr = 16000
duration = 2.0
t = np.linspace(0, duration, int(sr * duration), endpoint=False)
synth_signal = 0.5 * np.sin(2 * np.pi * 180 * t) + 0.25 * np.sin(2 * np.pi * 360 * t)
synth_signal[int(sr * 0.8):int(sr * 1.2)] = 0.0

f_human = 180.0 + 35.0 * np.sin(2 * np.pi * 2.0 * t) + np.random.normal(0, 5.0, len(t))
phase_human = 2 * np.pi * np.cumsum(f_human) / sr
human_signal = 0.4 * np.sin(phase_human) + np.random.normal(0, 0.008, len(t))

synth_wav = make_wav_bytes(synth_signal, sr)
human_wav = make_wav_bytes(human_signal, sr)

res_ai_audio = decode_audio(synth_wav, "synth.wav")
print("Synth Audio overallRisk:", res_ai_audio["overallRisk"], "label:", res_ai_audio["label"])
assert 86 <= res_ai_audio["overallRisk"] <= 94, f"Expected 86-94, got {res_ai_audio['overallRisk']}"
assert res_ai_audio["label"] == "SYNTHETIC / AI VOICE CLONE DETECTED"
assert len(res_ai_audio["breakdown"]) == 3
print("Audio synth breakdown:", res_ai_audio["breakdown"])

res_human_audio = decode_audio(human_wav, "human.wav")
print("Human Audio overallRisk:", res_human_audio["overallRisk"], "label:", res_human_audio["label"])
assert 12 <= res_human_audio["overallRisk"] <= 22, f"Expected 12-22, got {res_human_audio['overallRisk']}"
assert res_human_audio["label"] == "AUTHENTIC / HUMAN VOICE"
assert len(res_human_audio["breakdown"]) == 2
print("Audio human breakdown:", res_human_audio["breakdown"])

res_empty_audio = decode_audio(None, "empty.wav")
print("Empty Audio overallRisk:", res_empty_audio["overallRisk"], "label:", res_empty_audio["label"])
assert 12 <= res_empty_audio["overallRisk"] <= 22
assert res_empty_audio["label"] == "AUTHENTIC / HUMAN VOICE"

res_corrupt_audio = decode_audio(b"corrupted header garbage", "corrupted.wav")
print("Corrupt Audio overallRisk:", res_corrupt_audio["overallRisk"], "label:", res_corrupt_audio["label"])
assert 12 <= res_corrupt_audio["overallRisk"] <= 22
assert res_corrupt_audio["label"] == "AUTHENTIC / HUMAN VOICE"

print(">>> ALL UNIT FORENSIC TESTS PASSED SUCCESSFULLY! <<<")
