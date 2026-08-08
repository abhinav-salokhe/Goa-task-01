import { useCallback, useEffect, useRef, useState } from 'react';
import { Header } from './components/Header';
import { ModeSelector } from './components/ModeSelector';
import { UploadZone } from './components/UploadZone';
import { PhotoControls, DEFAULT_PHOTO_TRANSFORM } from './components/PhotoControls';
import { FilterSelector } from './components/FilterSelector';
import { BuilderForm, randomizeBuilder } from './components/BuilderForm';
import { PfpStyleSelector } from './components/PfpStyleSelector';
import { StickerSelector } from './components/StickerSelector';
import { SquadUploader, SquadForm } from './components/SquadUploader';
import { PreviewPanel } from './components/PreviewPanel';
import { BuilderCardPreview } from './components/BuilderCardPreview';
import { PfpPreview } from './components/PfpPreview';
import { SquadPreview } from './components/SquadPreview';
import { DownloadButton } from './components/DownloadButton';
import { ShareButton } from './components/ShareButton';
import { Toast, type ToastType } from './components/Toast';
import { triggerConfetti } from './components/ConfettiEffect';
import type {
  AppMode,
  BuilderData,
  PhotoState,
  PfpSettings,
  SquadMember,
  SquadSettings,
} from './types';
import {
  createDefaultBuilderData,
  createDefaultPfpSettings,
  createDefaultSquadSettings,
  createEmptyPhotoState,
  createSquadMember,
} from './types';
import { loadPrefs, savePrefs } from './utils/storage';
import { revokeImageUrl } from './utils/imageUtils';
import { canvasToBlob, downloadBlob } from './utils/shareUtils';

function App() {
  const prefs = loadPrefs();
  const [mode, setMode] = useState<AppMode>(
    (prefs.mode as AppMode) || 'builder',
  );
  const [photo, setPhoto] = useState<PhotoState>(createEmptyPhotoState());
  const [builderData, setBuilderData] = useState<BuilderData>(() => {
    const defaults = createDefaultBuilderData();
    return {
      ...defaults,
      fullName: prefs.builderName || defaults.fullName,
      role: prefs.builderRole || defaults.role,
      techStack: prefs.builderStack || defaults.techStack,
      motto: prefs.builderMotto || defaults.motto,
      builderClass: prefs.builderClass || defaults.builderClass,
    };
  });
  const [pfpSettings, setPfpSettings] = useState<PfpSettings>(() => {
    const defaults = createDefaultPfpSettings();
    return {
      ...defaults,
      style: (prefs.pfpStyle as PfpSettings['style']) || defaults.style,
    };
  });
  const [squadSettings, setSquadSettings] = useState<SquadSettings>(() => {
    const defaults = createDefaultSquadSettings();
    return {
      ...defaults,
      members: [createSquadMember('1'), createSquadMember('2')],
    };
  });
  const [selectedSquadMemberId, setSelectedSquadMemberId] = useState<string>('1');

  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const exportCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  }, []);

  const showError = useCallback(
    (message: string) => showToast(message, 'error'),
    [showToast],
  );

  // Persist preferences
  useEffect(() => {
    savePrefs({
      mode,
      pfpStyle: pfpSettings.style,
      builderName: builderData.fullName,
      builderRole: builderData.role,
      builderStack: builderData.techStack,
      builderMotto: builderData.motto,
      builderClass: builderData.builderClass,
    });
  }, [mode, pfpSettings.style, builderData]);

  const handlePhotoUpload = useCallback(
    (image: HTMLImageElement, url: string) => {
      revokeImageUrl(photo.imageUrl);
      setPhoto((prev) => ({
        ...prev,
        image,
        imageUrl: url,
      }));
    },
    [photo.imageUrl],
  );

  const handlePhotoTransform = useCallback((partial: Partial<PhotoState>) => {
    setPhoto((prev) => ({ ...prev, ...partial }));
  }, []);

  const handleResetPhoto = useCallback(() => {
    setPhoto((prev) => ({
      ...prev,
      ...DEFAULT_PHOTO_TRANSFORM,
    }));
  }, []);

  const handleRandomize = useCallback(() => {
    setBuilderData((prev) => randomizeBuilder(prev));
  }, []);

  const handleSquadPhotoUpload = useCallback(
    (id: string, image: HTMLImageElement, url: string) => {
      setSquadSettings((prev) => ({
        ...prev,
        members: prev.members.map((m) => {
          if (m.id === id) {
            revokeImageUrl(m.photo.imageUrl);
            return {
              ...m,
              photo: { ...m.photo, image, imageUrl: url },
            };
          }
          return m;
        }),
      }));
    },
    [],
  );

  const handleAddSquadMember = useCallback(() => {
    setSquadSettings((prev) => {
      if (prev.members.length >= 4) return prev;
      return {
        ...prev,
        members: [...prev.members, createSquadMember(String(Date.now()))],
      };
    });
  }, []);

  const handleRemoveSquadMember = useCallback((id: string) => {
    setSquadSettings((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== id),
    }));
  }, []);

  const handleSquadMemberChange = useCallback(
    (id: string, partial: Partial<SquadMember>) => {
      setSquadSettings((prev) => ({
        ...prev,
        members: prev.members.map((m) => (m.id === id ? { ...m, ...partial } : m)),
      }));
    },
    [],
  );

  const handleCanvasReady = useCallback((canvas: HTMLCanvasElement) => {
    exportCanvasRef.current = canvas;
  }, []);

  const getDownloadFilename = (): string => {
    switch (mode) {
      case 'pfp':
        return 'goa-pfp-frame.png';
      case 'squad':
        return 'goa-squad-frame.png';
      default:
        return 'goa-builder-card.png';
    }
  };

  const canDownload = (): boolean => {
    if (mode === 'squad') {
      return squadSettings.members.filter((m) => m.photo.image).length >= 2;
    }
    return photo.image !== null;
  };

  const getSuccessMessage = (): string => {
    switch (mode) {
      case 'pfp':
        return 'Your Goa PFP Frame is ready! 🌴';
      case 'squad':
        return 'Your Goa Squad Frame is ready! 🌴';
      default:
        return 'Your Goa Builder Pass is ready! 🌴';
    }
  };

  const handleDownload = async () => {
    if (!exportCanvasRef.current) {
      showError('Nothing to download yet. Upload a photo first.');
      return;
    }

    setIsDownloading(true);
    try {
      const blob = await canvasToBlob(exportCanvasRef.current);
      downloadBlob(blob, getDownloadFilename());
      triggerConfetti();
      showToast(getSuccessMessage());
    } catch {
      showError('Canvas export failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const renderPreview = () => {
    switch (mode) {
      case 'pfp':
        return (
          <PfpPreview
            photo={photo.image}
            transform={photo}
            style={pfpSettings.style}
            sticker={pfpSettings.sticker}
            onCanvasReady={handleCanvasReady}
          />
        );
      case 'squad':
        return (
          <SquadPreview
            members={squadSettings.members}
            teamName={squadSettings.teamName}
            teamMotto={squadSettings.teamMotto}
            onCanvasReady={handleCanvasReady}
          />
        );
      default:
        return (
          <BuilderCardPreview
            photo={photo.image}
            transform={photo}
            data={builderData}
            onCanvasReady={handleCanvasReady}
          />
        );
    }
  };

  const renderControls = () => {
    if (mode === 'squad') {
      return (
        <>
          <SquadForm
            teamName={squadSettings.teamName}
            teamMotto={squadSettings.teamMotto}
            onChange={(partial) => setSquadSettings((prev) => ({ ...prev, ...partial }))}
          />
          <SquadUploader
            members={squadSettings.members}
            onAdd={handleAddSquadMember}
            onRemove={handleRemoveSquadMember}
            onPhotoUpload={handleSquadPhotoUpload}
            onMemberChange={handleSquadMemberChange}
            onError={showError}
          />
        </>
      );
    }

    return (
      <>
        <UploadZone onUpload={handlePhotoUpload} onError={showError} />
        {mode === 'builder' && (
          <BuilderForm
            data={builderData}
            onChange={(partial) => setBuilderData((prev) => ({ ...prev, ...partial }))}
            onRandomize={handleRandomize}
          />
        )}
        {mode === 'pfp' && (
          <>
            <PfpStyleSelector
              value={pfpSettings.style}
              onChange={(style) => setPfpSettings((prev) => ({ ...prev, style }))}
            />
            <StickerSelector
              value={pfpSettings.sticker}
              onChange={(sticker) => setPfpSettings((prev) => ({ ...prev, sticker }))}
            />
          </>
        )}
      </>
    );
  };

  const showPhotoControls = mode !== 'squad' ? photo.image !== null : squadSettings.members.some((m) => m.photo.image);

  const selectedSquadMember = squadSettings.members.find((m) => m.id === selectedSquadMemberId)
    ?? squadSettings.members[0];

  const activePhotoTransform = mode === 'squad' && selectedSquadMember
    ? selectedSquadMember.photo
    : photo;

  const handleActivePhotoTransform = useCallback(
    (partial: Partial<PhotoState>) => {
      if (mode === 'squad' && selectedSquadMember) {
        setSquadSettings((prev) => ({
          ...prev,
          members: prev.members.map((m) =>
            m.id === selectedSquadMember.id
              ? { ...m, photo: { ...m.photo, ...partial } }
              : m,
          ),
        }));
      } else {
        handlePhotoTransform(partial);
      }
    },
    [mode, selectedSquadMember, handlePhotoTransform],
  );

  const handleActivePhotoReset = useCallback(() => {
    if (mode === 'squad' && selectedSquadMember) {
      setSquadSettings((prev) => ({
        ...prev,
        members: prev.members.map((m) =>
          m.id === selectedSquadMember.id
            ? { ...m, photo: { ...m.photo, ...DEFAULT_PHOTO_TRANSFORM } }
            : m,
        ),
      }));
    } else {
      handleResetPhoto();
    }
  }, [mode, selectedSquadMember, handleResetPhoto]);

  return (
    <>
      <div className="tropical-bg" aria-hidden="true" />

      <div className="relative mx-auto min-h-screen max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <div className="space-y-6">
          <Header />
          <ModeSelector mode={mode} onChange={setMode} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left: Controls */}
            <div className="space-y-4 animate-slide-up" id={`panel-${mode}`} role="tabpanel">
              {renderControls()}
            </div>

            {/* Right: Preview */}
            <div className="lg:sticky lg:top-6 lg:self-start">
              <PreviewPanel>{renderPreview()}</PreviewPanel>
            </div>
          </div>

          {/* Bottom: Photo controls + Download/Share */}
          <div className="space-y-4 animate-fade-in" id="download-section">
            {showPhotoControls && (
              <div className="space-y-4">
                {mode === 'squad' && (
                  <div className="goa-card p-4">
                    <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-goa-cream">
                      Edit Member Photo
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {squadSettings.members.map((m, i) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setSelectedSquadMemberId(m.id)}
                          disabled={!m.photo.image}
                          className={`rounded-lg px-3 py-2 text-xs font-bold uppercase transition ${
                            selectedSquadMemberId === m.id
                              ? 'bg-goa-pink text-goa-cream'
                              : 'border border-goa-green/30 bg-goa-bg text-goa-muted hover:border-goa-green disabled:opacity-40'
                          }`}
                        >
                          Member {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <PhotoControls
                    transform={activePhotoTransform}
                    onChange={handleActivePhotoTransform}
                    onReset={handleActivePhotoReset}
                  />
                  <FilterSelector
                    value={activePhotoTransform.filter}
                    onChange={(filter) => handleActivePhotoTransform({ filter })}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DownloadButton
                onDownload={handleDownload}
                filename={getDownloadFilename()}
                disabled={!canDownload()}
                isLoading={isDownloading}
              />
              <ShareButton
                mode={mode}
                builderId={builderData.builderId}
                pfpStyle={pfpSettings.style}
                teamName={squadSettings.teamName}
              />
            </div>
          </div>

          <footer className="pb-6 text-center text-xs text-goa-muted">
            <p>GOA BUILDER — Frame & Builder ID Generator</p>
            <p className="mt-1">Build in Paradise • Ship from Goa • #GOABUILDER</p>
          </footer>
        </div>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </>
  );
}

export default App;
