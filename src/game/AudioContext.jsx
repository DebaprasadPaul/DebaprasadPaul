import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { playRetroClick, playRetroHover, playCardOpen, playCardClose } from './soundEffects';

const AudioContext = createContext();

export function useAudio() {
    return useContext(AudioContext);
}

export function AudioProvider({ children }) {
    const [isAudioEnabled, setIsAudioEnabled] = useState(false);
    const [isAutoPlay, setIsAutoPlay] = useState(false);
    const [currentUtterance, setCurrentUtterance] = useState(null);
    const audioRef = useRef(null);
    const ambientRef = useRef(null);

    // Initialize large ambient background audio
    useEffect(() => {
        const bgAudio = new Audio('/audio/bg_ambient.mp3');
        bgAudio.loop = true;
        bgAudio.volume = 0.3; // keep it subtle
        ambientRef.current = bgAudio;

        return () => {
            bgAudio.pause();
            bgAudio.src = '';
        };
    }, []);

    // Manage ambient audio playback alongside global audio state
    useEffect(() => {
        if (isAudioEnabled && ambientRef.current) {
            ambientRef.current.play().catch(e => console.log('Autoplay prevented for ambient'));
        } else if (!isAudioEnabled && ambientRef.current) {
            ambientRef.current.pause();
        }
    }, [isAudioEnabled]);

    // Cancel speech/audio when audio is disabled
    useEffect(() => {
        if (!isAudioEnabled) {
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            setCurrentUtterance(null);
        }
    }, [isAudioEnabled]);

    const stopSpeaking = useCallback(() => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
        setCurrentUtterance(null);
    }, []);

    const speak = useCallback((id, text, onEnd = null) => {
        if (!isAudioEnabled) return;

        stopSpeaking(); // Cancel any ongoing speech

        // First attempt to play a high-quality pre-rendered MP3 file
        const audio = new Audio(`/audio/${id}.mp3`);

        audio.play().then(() => {
            // Found and playing MP3!
            audioRef.current = audio;
            setCurrentUtterance('audio');

            audio.onended = () => {
                setCurrentUtterance(null);
                if (onEnd) onEnd();
            };
        }).catch((e) => {
            // File not found or couldn't play, fallback to browser TTS!
            if (window.speechSynthesis) {
                const utterance = new SpeechSynthesisUtterance(text);

                // Wait for voices to load if they haven't yet (sometimes takes a tick in browsers)
                let voices = window.speechSynthesis.getVoices();

                // Try to find a deeper, dramatic voice (Indian Male/Hindi if possible)
                const isIndianMale = (v) => (v.lang.includes('hi-IN') || v.lang.includes('en-IN')) && (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('ravi') || v.name.toLowerCase().includes('prabhat'));
                const isIndian = (v) => v.lang.includes('hi-IN') || v.lang.includes('en-IN');
                const isBritishMale = (v) => v.lang.includes('en-GB') && v.name.toLowerCase().includes('male');

                const preferredVoice = voices.find(isIndianMale) || voices.find(isIndian) || voices.find(isBritishMale) || voices.find(v => v.lang.includes('en'));

                if (preferredVoice) {
                    utterance.voice = preferredVoice;
                }

                // Deeper, slower, more dramatic speaking rate
                utterance.rate = 0.85;
                utterance.pitch = 0.6;

                utterance.onend = () => {
                    setCurrentUtterance(null);
                    if (onEnd) onEnd();
                };

                setCurrentUtterance('speech');
                window.speechSynthesis.speak(utterance);
            } else if (onEnd) {
                onEnd();
            }
        });
    }, [isAudioEnabled, stopSpeaking]);

    const playSfx = useCallback((type) => {
        if (!isAudioEnabled) return;

        switch (type) {
            case 'click': playRetroClick(); break;
            case 'hover': playRetroHover(); break;
            case 'open': playCardOpen(); break;
            case 'close': playCardClose(); break;
            case 'bell': {
                const bell = new Audio('/audio/bell.mp3');
                bell.volume = 0.6;
                bell.play().catch(() => { });
                break;
            }
            default: break;
        }
    }, [isAudioEnabled]);

    const value = {
        isAudioEnabled,
        setIsAudioEnabled,
        isAutoPlay,
        setIsAutoPlay,
        speak,
        stopSpeaking,
        playSfx,
        isSpeaking: !!currentUtterance,
    };

    return (
        <AudioContext.Provider value={value}>
            {children}
        </AudioContext.Provider>
    );
}
