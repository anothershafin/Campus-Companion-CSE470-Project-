import React from 'react'

export default function RatingStars({ value=0, onChange }) {
  const [hover, setHover] = React.useState(0)
  const stars = [1,2,3,4,5]
  return (
    <div className="rating">
      {stars.map(s => (
        <span key={s}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange && onChange(s)}>
          {(hover || value) >= s ? '★' : '☆'}
        </span>
      ))}
    </div>
  )
}
