import React, { useState } from 'react';
import { ReactMediaRecorder } from "react-media-recorder";
import axios from 'axios'
import '../assets/css/style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Microphone() {

    const [isRecording, setIsRecording] = useState(false); // State to track recording
    const [transcript, setTranscript] = useState(''); // State to store transcription
    const [isLoading, setIsLoading] = useState(false); // Loading state for transcription
    const [error, setError] = useState(''); // State to store error messages

    // Function to transcribe the audio using Deepgram API
    const transcribeAudio = async (audioBlob) => {
        setIsLoading(true);
        setError(''); // Reset error state
        const apiKey = 'd6870d99b37f47327b8769a6c4cf27c0e0571e53'; // Replace with your Deepgram API key

        try {
            const response = await axios.post(
                'https://api.deepgram.com/v1/listen',
                audioBlob,
                {
                    headers: {
                        Authorization: `Token ${apiKey}`,
                        'Content-Type': 'audio/wav',
                    },
                    params: {
                        punctuate: true,
                    },
                }
            );

            setTranscript(response.data.results.channels[0].alternatives[0].transcript);
        } catch (error) {
            setError('An error occurred while transcribing the audio. Please try again.'); // Set error message
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card-body text-center p-4">
                <h2 className="card-title mb-3"><i className="fas fa-microphone-alt"></i> Audio Recorder</h2>
                <p className="card-text">
                    Click the button below to start recording your audio.
                </p>

                <ReactMediaRecorder
                    audio
                    render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
                        <div>
                            <p className={`status-text mb-4 ${isRecording ? 'text-danger' : 'text-secondary'}`}>
                                {isRecording ? (
                                    <p className={`status-text mb-4 text-danger`}>
                                        {status}
                                    </p>
                                ) : null}
                            </p>

                            <button
                                className={`btn btn-lg ${isRecording ? 'btn-danger' : 'btn-primary'} mx-2`}
                                onClick={() => {
                                    if (isRecording) {
                                        stopRecording();
                                        setIsRecording(false);
                                    } else {
                                        startRecording();
                                        setIsRecording(true);
                                    }
                                }}
                            >
                                <i className={isRecording ? 'fas fa-stop' : 'fas fa-microphone'}></i>
                                {isRecording ? ' Stop Recording' : ' Start Recording'}
                            </button>

                            <div className="mt-5">
                                {mediaBlobUrl && (
                                    <>
                                        <h4 className="mb-3">Your Recorded Audio:</h4>
                                        <audio controls src={mediaBlobUrl} className="w-100 mb-3"></audio>

                                        {/* Transcription button */}
                                        <button
                                            className="btn btn-success btn-lg"
                                            onClick={async () => {
                                                const audioBlob = await fetch(mediaBlobUrl).then((res) => res.blob());
                                                transcribeAudio(audioBlob);
                                            }}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Transcribing...' : 'Transcribe Audio'}
                                        </button>
                                    </>
                                )}

                                {/* Display the transcription */}
                                {transcript && (
                                    <div className="mt-4">
                                        <h5>Transcription:</h5>
                                        <div className="alert alert-secondary">{transcript}</div>
                                    </div>
                                )}

                                {/* Display error message */}
                                {error && (
                                    <div className="mt-4">
                                        <div className="alert alert-danger">{error}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                />
            </div>
        </div>
    )
}
export default Microphone