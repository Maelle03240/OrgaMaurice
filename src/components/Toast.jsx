export default function Toast({ message, show }) {
  return (
    <div className={`fixed bottom-5 right-5 z-[600] bg-jungle-dark text-white text-[13px] font-medium px-4 py-2.5 rounded-sm shadow-xl transition-all duration-300 pointer-events-none ${
      show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
    }`}>
      {message}
    </div>
  )
}
