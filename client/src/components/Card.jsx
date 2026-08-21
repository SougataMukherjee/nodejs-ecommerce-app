function Card({ 
  title, 
  children, 
  bgColor = "bg-base-300",
  textColor = "text-white",
  borderColor = "border-gray-700",
  shadow = "shadow-lg",
  padding = "p-6",
  rounded = "rounded-lg",
  showAura = true
}) {
  return (
    <div className={`card ${bgColor} ${textColor} w-full max-w-md border ${borderColor} ${shadow} ${rounded} ${showAura ? 'aura' : ''}`}>
      <div className={`card-body ${padding}`}>
        <h2 className="card-title text-xl font-bold" style={{ color: '#ff6600' }}>{title}</h2>
        <div className="divider my-2" style={{ borderColor: '#2a2a3e' }}></div>
        {children}
      </div>
    </div>
  );
}

export default Card;