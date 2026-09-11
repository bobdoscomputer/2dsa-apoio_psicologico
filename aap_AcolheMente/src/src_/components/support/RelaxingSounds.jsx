import React, { useState, useRef } from "react";
import { Volume2, VolumeX, CloudRain, Wind, Bird, Waves } from "lucide-react";

const sounds = [
  { id: "rain", label: "Chuva", icon: CloudRain, color: "bg-sky-100 text-sky-600", url: "https://cdn.pixabay.com/audio/2022/02/22/audio_d1718ab41b.mp3" },
  { id: "wind", label: "Vento", icon: Wind, color: "bg-emerald-100 text-emerald-600", url: "https://cdn.pixabay.com/audio/2021/08/09/audio_dc39bde808.mp3" },
  { id: "birds", label: "Pássaros", icon: Bird, color: "bg-amber-100 text-amber-600", url: "https://cdn.pixabay.com/audio/2022/03/09/audio_c8eb36ad06.mp3" },
  { id: "waves", label: "Ondas", icon: Waves, color: "bg-violet-100 text-violet-600", url: "https://cdn.pixabay.com/audio/2022/05/31/audio_98a130ec4c.mp3" },
];

export default function RelaxingSounds() {
  const [playing, setPlaying] = useState(null);
  const audioRef = useRef(null);

  const toggle = (sound) => {
    if (playing === sound.id) {
      audioRef.current?.pause();
      setPlaying(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      const audio = new Audio(sound.url);
      audio.loop = true;
      audio.play().catch(() => {});
      audioRef.current = audio;
      setPlaying(sound.id);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8">
      <h2 className="font-heading text-xl font-bold text-slate-800 mb-2">Sons Relaxantes</h2>
      <p className="text-slate-500 text-sm mb-6">Escolha um som ambiente para ajudar a relaxar e se concentrar.</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {sounds.map(sound => {
          const active = playing === sound.id;
          return (
            <button
              key={sound.id}
              onClick={() => toggle(sound)}
              className={`rounded-2xl p-6 flex flex-col items-center gap-3 transition-all border-2 ${
                active ? "border-sky-400 bg-sky-50 shadow-md" : "border-transparent bg-slate-50 hover:bg-slate-100"
              }`}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${sound.color}`}>
                {active ? <Volume2 className="w-6 h-6" /> : <sound.icon className="w-6 h-6" />}
              </div>
              <span className="text-sm font-medium text-slate-700">{sound.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
