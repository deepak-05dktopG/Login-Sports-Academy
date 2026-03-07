import PropTypes from 'prop-types'

const WAVES = {
  soft: 'M0,64L48,69.3C96,75,192,85,288,85.3C384,85,480,75,576,74.7C672,75,768,85,864,90.7C960,96,1056,96,1152,85.3C1248,75,1344,53,1392,42.7L1440,32V120H0Z',
  crest: 'M0,56 C180,98 360,14 540,56 C720,98 900,14 1080,56 C1260,98 1440,14 1440,14 V120 H0 Z',
}

export default function WaveSeparator({ fill = '#fff', variant = 'soft', flipY = false, className = '' }) {
  const d = WAVES[variant] || WAVES.soft
  return (
    <svg
      className={className}
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      style={{ width: '100%', height: '64px', display: 'block', transform: flipY ? 'scaleY(-1)' : undefined }}
      aria-hidden="true"
      focusable="false"
    >
      <path fill={fill} d={d} />
    </svg>
  )
}

WaveSeparator.propTypes = {
  fill: PropTypes.string,
  variant: PropTypes.oneOf(['soft', 'crest']),
  flipY: PropTypes.bool,
  className: PropTypes.string,
}
