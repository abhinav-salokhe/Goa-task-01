import { Palmtree, BookOpen, Send } from 'lucide-react';

export function Header() {
  return (
    <header className="goa-card px-4 py-4 md:px-6 md:py-5 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-goa-pink via-goa-sunset to-goa-yellow shadow-lg">
            <Palmtree className="h-6 w-6 text-goa-bg" aria-hidden="true" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold uppercase tracking-tight text-goa-cream md:text-2xl">
              GOA BUILDER
            </h1>
            <p className="text-sm text-goa-muted">Frame & Builder ID Generator</p>
            <p className="mt-0.5 text-xs font-medium text-goa-green">
              Build in Paradise • Ship from Goa
            </p>
          </div>
          <span className="hidden rounded-full border border-goa-pink/40 bg-goa-pink/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-goa-pink sm:inline-block">
            #GOABUILDER
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="btn-secondary flex items-center gap-2 rounded-lg px-4 py-2 text-sm"
            aria-label="Open guide"
            onClick={() =>
              window.open(
                'https://github.com',
                '_blank',
                'noopener,noreferrer',
              )
            }
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            Guide
          </button>
          <button
            type="button"
            className="btn-primary flex items-center gap-2 rounded-lg px-4 py-2 text-sm"
            aria-label="Submit your builder identity"
            onClick={() => {
              document.getElementById('download-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            Submit
          </button>
        </div>
      </div>
    </header>
  );
}
