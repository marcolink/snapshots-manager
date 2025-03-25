import {useEffect, useRef} from "react";

type TimelineProps<T extends { createdAt: string }> = {
  entries: T[]
  itemRenderer: (entry: T) => JSX.Element,
  iconRenderer: (entry: T) => { component: JSX.Element, className: string },
  getKey: (entry: T) => string,
}

export function MiniTimeline<T extends { createdAt: string }>(
  {
    itemRenderer,
    iconRenderer,
    getKey,
    entries,
  }: TimelineProps<T>) {

  const scrollableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [entries]);

  return (
    <div ref={scrollableRef} className="w-full mx-auto overflow-y-auto scroll-smooth max-h-80">
      <div className="pointer-events-none sticky top-0 h-4 bg-gradient-to-b from-white to-transparent z-10"></div>

      <div
        className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-50 before:via-slate-300 before:to-slate-50">
        {entries.map((entry) => {
          const icon = iconRenderer(entry)
          return (
            <div
              key={getKey(entry)}
              className={`relative flex items-center justify-between md:justify-normal group is-active`}>
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border border-white shadow shrink-0 md:order-1 'md:translate-x-1/2'} ${icon.className}`}>
                {icon.component}
              </div>

              <div className="w-[calc(100%-3.5rem)]">
                {itemRenderer(entry)}
              </div>
            </div>
          )
        })}
      </div>
      <div className="pointer-events-none sticky bottom-0 h-4 bg-gradient-to-t from-white to-transparent z-10"></div>

    </div>
  );
}