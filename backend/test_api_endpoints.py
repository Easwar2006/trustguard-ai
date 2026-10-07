import io
import json
import urllib.request
import urllib.parse
import numpy as np
import scipy.io.wavfile

# Helper for WAV generation
def make_wav_bytes(signal, sr=16000):
    buf = io.BytesIO()
    int_sig = np.clip(signal * 32767, -32768, 32767).astype(np.int16)
    scipy.io.wavfile.write(buf, sr, int_sig)
    return buf.getvalue()

sr = 16000
duration = 2.0
t = np.linspace(0, duration, int(sr * duration), endpoint=False)

# Synthetic audio
synth_signal = 0.5 * np.sin(2 * np.pi * 180 * t) + 0.25 * np.sin(2 * np.pi * 360 * t)
synth_signal[int(sr * 0.8):int(sr * 1.2)] = 0.0
synth_wav = make_wav_bytes(synth_signal, sr)

# Human audio
f_human = 180.0 + 35.0 * np.sin(2 * np.pi * 2.0 * t) + np.random.normal(0, 5.0, len(t))
phase_human = 2 * np.pi * np.cumsum(f_human) / sr
human_signal = 0.4 * np.sin(phase_human) + np.random.normal(0, 0.008, len(t))
human_wav = make_wav_bytes(human_signal, sr)

ai_text = """In today's ever-evolving digital tapestry, artificial intelligence plays a pivotal role in modern technology. Furthermore, as organizations delve deeper into automated workflows, cybersecurity becomes a crucial element. Moreover, it is a testament to human innovation that multifaceted algorithms can foster resilience seamlessly. In conclusion, the realm of neural architectures will continue to underscore our paramount technological advancements."""

human_text = """Hey dude, so I checked out that website you sent yesterday. Honestly, idk what they were thinking with that redesign lol! It is kinda confusing to navigate tbh. Anyway, call me when you get a chance, we gotta figure out what we are doing for lunch."""

def post_multipart(url, fields, files):
    boundary = "----TrustGuardBoundaryTest12345"
    body = bytearray()
    for name, value in fields.items():
        body.extend(f"--{boundary}\r\n".encode("utf-8"))
        body.extend(f'Content-Disposition: form-data; name="{name}"\r\n\r\n'.encode("utf-8"))
        body.extend(f"{value}\r\n".encode("utf-8"))
    for name, (filename, content, content_type) in files.items():
        body.extend(f"--{boundary}\r\n".encode("utf-8"))
        body.extend(f'Content-Disposition: form-data; name="{name}"; filename="{filename}"\r\n'.encode("utf-8"))
        body.extend(f"Content-Type: {content_type}\r\n\r\n".encode("utf-8"))
        body.extend(content)
        body.extend(b"\r\n")
    body.extend(f"--{boundary}--\r\n".encode("utf-8"))

    req = urllib.request.Request(
        url,
        data=bytes(body),
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
        method="POST"
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

def post_json(url, data):
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

print("Testing API Endpoints on http://127.0.0.1:8000 ...")

# 1. /api/analyze with AI text
res1 = post_multipart("http://127.0.0.1:8000/api/analyze", {"text_payload": ai_text, "modality": "text"}, {})
print("\n1. /api/analyze (AI Text):")
print(f"   overallRisk: {res1.get('overallRisk')}, label: {res1.get('label')}")
print(f"   breakdown: {res1.get('breakdown')}")
assert 84 <= res1.get("overallRisk") <= 93
assert res1.get("label") == "AI-GENERATED SYNTHETIC TEXT"
assert len(res1.get("breakdown", [])) == 3

# 2. /api/analyze with Human text
res2 = post_multipart("http://127.0.0.1:8000/api/analyze", {"text_payload": human_text, "modality": "text"}, {})
print("\n2. /api/analyze (Human Text):")
print(f"   overallRisk: {res2.get('overallRisk')}, label: {res2.get('label')}")
print(f"   breakdown: {res2.get('breakdown')}")
assert 10 <= res2.get("overallRisk") <= 20
assert res2.get("label") == "AUTHENTIC / HUMAN-WRITTEN TEXT"
assert len(res2.get("breakdown", [])) == 2

# 3. /api/analyze with Synthetic Audio
res3 = post_multipart("http://127.0.0.1:8000/api/analyze", {"modality": "audio"}, {"file": ("clone_voice.wav", synth_wav, "audio/wav")})
print("\n3. /api/analyze (Synth Audio):")
print(f"   overallRisk: {res3.get('overallRisk')}, label: {res3.get('label')}")
print(f"   breakdown: {res3.get('breakdown')}")
assert 86 <= res3.get("overallRisk") <= 94
assert res3.get("label") == "SYNTHETIC / AI VOICE CLONE DETECTED"
assert len(res3.get("breakdown", [])) == 3

# 4. /api/analyze with Human Audio
res4 = post_multipart("http://127.0.0.1:8000/api/analyze", {"modality": "audio"}, {"file": ("natural_voice.wav", human_wav, "audio/wav")})
print("\n4. /api/analyze (Human Audio):")
print(f"   overallRisk: {res4.get('overallRisk')}, label: {res4.get('label')}")
print(f"   breakdown: {res4.get('breakdown')}")
assert 12 <= res4.get("overallRisk") <= 22
assert res4.get("label") == "AUTHENTIC / HUMAN VOICE"
assert len(res4.get("breakdown", [])) == 2

# 5. /api/detect/text direct endpoint
res5_ai = post_json("http://127.0.0.1:8000/api/detect/text", {"text": ai_text})
print("\n5. /api/detect/text (AI text):")
print(f"   overallRisk: {res5_ai.get('overallRisk')}, label: {res5_ai.get('label')}")
assert 84 <= res5_ai.get("overallRisk") <= 93

res5_hum = post_json("http://127.0.0.1:8000/api/detect/text", {"text": human_text})
print("\n6. /api/detect/text (Human text):")
print(f"   overallRisk: {res5_hum.get('overallRisk')}, label: {res5_hum.get('label')}")
assert 10 <= res5_hum.get("overallRisk") <= 20

# 6. /api/detect/audio direct endpoint
res6_synth = post_multipart("http://127.0.0.1:8000/api/detect/audio", {}, {"file": ("ai_voice.wav", synth_wav, "audio/wav")})
print("\n7. /api/detect/audio (Synth audio):")
print(f"   overallRisk: {res6_synth.get('overallRisk')}, label: {res6_synth.get('label')}")
assert 86 <= res6_synth.get("overallRisk") <= 94

res6_hum = post_multipart("http://127.0.0.1:8000/api/detect/audio", {}, {"file": ("human_voice.wav", human_wav, "audio/wav")})
print("\n8. /api/detect/audio (Human audio):")
print(f"   overallRisk: {res6_hum.get('overallRisk')}, label: {res6_hum.get('label')}")
assert 12 <= res6_hum.get("overallRisk") <= 22

# 7. Fallback & edge cases
res_short = post_multipart("http://127.0.0.1:8000/api/analyze", {"text_payload": "Hi there.", "modality": "text"}, {})
print("\n9. /api/analyze (Short text):")
print(f"   overallRisk: {res_short.get('overallRisk')}, label: {res_short.get('label')}")
assert 10 <= res_short.get("overallRisk") <= 20

res_empty_audio = post_multipart("http://127.0.0.1:8000/api/analyze", {"modality": "audio"}, {})
print("\n10. /api/analyze (Empty audio):")
print(f"   overallRisk: {res_empty_audio.get('overallRisk')}, label: {res_empty_audio.get('label')}")
assert 12 <= res_empty_audio.get("overallRisk") <= 22

print("\n>>> ALL 10 INTEGRATION TESTS COMPLETED SUCCESSFULLY! <<<")
