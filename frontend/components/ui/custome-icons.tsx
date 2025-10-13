function IconFlag(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M4 21V4m0 0h10l-1.5 3H20l-1.5 3H14l-1.5 3H4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
function IconRocket(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M7 14s1.5-5 7-10c2-2 5-2 5-2s0 3-2 5c-5.1 5.5-10 7-10 7z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 14l-3 3 3-1 1 3 3-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="6" r="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
function IconCalendar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 3v4M16 3v4M3 10h18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
function IconBolt(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}
function IconRepeat(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7l1-2h4l1 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
function IconPlus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M12 5v14M5 12h14M9 7l1 13h10l1-13M9 7l1-2h4l1 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
function IconTrash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7l1-2h4l1 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
function IconHash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M5 9h14M5 15h14M9 5 7 19M17 5l-2 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
function IconNote(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <rect x="4" y="3" width="16" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 8h8M8 12h8M8 16h5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export {IconBolt,IconCalendar,IconFlag,IconHash,IconNote,IconPlus,IconRocket,IconRepeat,IconTrash}