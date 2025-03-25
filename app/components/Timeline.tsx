import {Text} from "@contentful/f36-typography";

type TimelineProps<T extends { createdAt: string }> = {
  entries: T[]
  itemRenderer: (entry: T) => JSX.Element,
  iconRenderer: (entry: T) => { component: JSX.Element, className: string },
  dateRenderer: (entry: T) => string,
  getKey: (entry: T) => string,
  isOdd:(entry: T) => boolean
}

// https://cruip.com/3-examples-of-brilliant-vertical-timelines-with-tailwind-css/#example-1

export function Timeline<T extends { createdAt: string }>(
  {
    itemRenderer,
    iconRenderer,
    dateRenderer,
    getKey,
    entries,
    isOdd
  }: TimelineProps<T>) {
  return (
    <div className="w-full mx-auto">
      <div
        className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-50 before:via-slate-300 before:to-slate-50">
        {entries.map((entry) => {
          const icon = iconRenderer(entry)
          return (
            <div
              key={getKey(entry)}
              className={`relative flex items-center justify-between md:justify-normal ${isOdd(entry) ? 'md:flex-row-reverse' : ''} group is-active`}>
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border border-white bg-white shadow shrink-0 md:order-1 ${isOdd(entry) ? 'md:-translate-x-1/2' : 'md:translate-x-1/2'} ${icon.className}`}>
                {icon.component}
              </div>

              <div
                className={`flex items-center justify-center w-1/10 h-10 bg-white shrink-0 md:order-1 ${isOdd(entry) ? 'md:-translate-x-1/2' : 'md:translate-x-1/2'}`}>
                <Text fontWeight={'fontWeightMedium'} as={'i'}>{dateRenderer(entry)}</Text>
              </div>

              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)]">
                {itemRenderer(entry)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}