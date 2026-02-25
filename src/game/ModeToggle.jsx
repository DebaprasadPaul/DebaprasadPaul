import React from 'react';
import { useAudio } from './AudioContext';

export default function ModeToggle() {
    const { isAudioEnabled, setIsAudioEnabled, isAutoPlay, setIsAutoPlay, playSfx } = useAudio();

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 font-['Press_Start_2P'] text-[10px]">
            {/* Main Audio Toggle */}
            <button
                onClick={() => {
                    setIsAudioEnabled(!isAudioEnabled);
                    if (!isAudioEnabled) playSfx('click'); // Play sound when turning ON
                }}
                onMouseEnter={() => playSfx('hover')}
                className={`p-3 border-4 rounded-lg shadow-[4px_4px_0px_rgba(0,0,0,0.3)] transition-all ${isAudioEnabled
                    ? 'bg-[#E8943A] border-[#5C4033] text-[#2D1B0E]'
                    : 'bg-[#D4A76A] border-[#A08860] text-[#5C4033] opacity-70'
                    }`}
            >
                <div className="flex items-center gap-2">
                    <span className="text-base">{isAudioEnabled ? '🔊' : '🔇'}</span>
                    <span>SOUND {isAudioEnabled ? 'ON' : 'OFF'}</span>
                </div>
            </button>

            {/* Auto Play Toggle (Only visible if Audio is ON) */}
            {isAudioEnabled && (
                <button
                    onClick={() => {
                        setIsAutoPlay(!isAutoPlay);
                        playSfx('click');
                    }}
                    onMouseEnter={() => playSfx('hover')}
                    className={`p-2 border-4 rounded-lg shadow-[4px_4px_0px_rgba(0,0,0,0.3)] transition-all ${isAutoPlay
                        ? 'bg-[#5A8C3C] border-[#3D6B2E] text-white'
                        : 'bg-[#D4A76A] border-[#A08860] text-[#5C4033]'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-sm">{isAutoPlay ? '▶️' : '⏸️'}</span>
                        <span>AUTO: {isAutoPlay ? 'ON' : 'OFF'}</span>
                    </div>
                </button>
            )}
        </div>
    );
}
