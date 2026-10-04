import React from 'react';

interface CPRLogoProps {
  className?: string;
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'seal' | 'icon' | 'badge';
  showSubtitle?: boolean;
}

export const CPRLogo: React.FC<CPRLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'seal'
}) => {
  let dimension = 48;
  if (typeof size === 'number') {
    dimension = size;
  } else {
    switch (size) {
      case 'sm':
        dimension = 36;
        break;
      case 'md':
        dimension = 48;
        break;
      case 'lg':
        dimension = 72;
        break;
      case 'xl':
        dimension = 110;
        break;
    }
  }

  // Variant 2: App icon like image.png (Deep blue rounded square with yellow CPR)
  if (variant === 'icon') {
    return (
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 drop-shadow-sm ${className}`}
        aria-label="CPR Icon"
      >
        {/* Rounded square background */}
        <rect width="100" height="100" rx="26" fill="#242B88" />
        {/* Subtle top gloss highlight */}
        <path
          d="M0 26C0 11.64 11.64 0 26 0H74C88.36 0 100 11.64 100 26V40C65 42 35 32 0 45V26Z"
          fill="white"
          fillOpacity="0.06"
        />
        {/* Yellow CPR serif text */}
        <text
          x="50"
          y="64"
          textAnchor="middle"
          fill="#FFD200"
          stroke="#D4A000"
          strokeWidth="1"
          fontFamily="'Times New Roman', Georgia, serif"
          fontWeight="bold"
          fontSize="38"
          letterSpacing="1.5"
          filter="drop-shadow(0 2px 3px rgba(0,0,0,0.35))"
        >
          CPR
        </text>
      </svg>
    );
  }

  // Variant 1: Official Circular Seal matching ChatGPT Image Oct 2, 2026
  // Stethoscope on left, stylized C (blue), P (red), R (blue),
  // "Medical Academy" in cursive, Red ECG heartbeat line with blue chest piece,
  // Bottom text: "Centre for Post-gRaduation (CPR)"
  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="CPR Medical Academy Seal Logo"
    >
      {/* Background circle */}
      <circle cx="200" cy="200" r="190" fill="#FFFFFF" />

      {/* Outer Blue Border Circle */}
      <circle
        cx="200"
        cy="200"
        r="184"
        stroke="#114C9E"
        strokeWidth="13"
        fill="none"
      />

      {/* ================= STETHOSCOPE ================= */}
      {/* Stethoscope Earpieces */}
      <path
        d="M 80 115 C 80 110, 86 110, 86 115"
        stroke="#114C9E"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M 108 115 C 108 110, 102 110, 102 115"
        stroke="#114C9E"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Stethoscope Binaural headset tubes */}
      <path
        d="M 83 115 C 65 140, 70 185, 95 195"
        stroke="#114C9E"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 105 115 C 122 140, 118 185, 95 195"
        stroke="#114C9E"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Stethoscope Connector joint */}
      <circle cx="95" cy="195" r="4.5" fill="#114C9E" />

      {/* Stethoscope Red Tube leading down & into the ECG line */}
      <path
        d="M 95 198 
           L 95 242 
           C 95 260, 115 260, 135 260 
           L 182 260 
           L 189 240 
           L 197 278 
           L 207 248 
           L 216 268 
           L 223 260 
           L 285 260"
        stroke="#E21B23"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Stethoscope Bell / Diaphragm (blue disk on the right) */}
      <circle cx="308" cy="256" r="15" fill="#114C9E" />
      <path
        d="M 296 256 A 12 12 0 0 1 316 247"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* ================= CPR LETTERS ================= */}
      {/* 'C' in Royal Blue */}
      <g fill="#114C9E">
        <path d="M 194 133 C 185 112 165 101 146 103 C 122 106 108 126 108 153 C 108 178 123 200 151 198 C 172 196 186 182 192 172 C 190 178 174 204 146 205 C 114 206 97 181 97 151 C 97 119 119 96 150 95 C 176 94 195 110 198 128 C 198 131 195 133 194 133 Z" />
      </g>

      {/* 'P' in Vibrant Red */}
      <g fill="#E21B23">
        <path d="M 203 194 C 206 185 212 153 218 127 C 220 119 223 110 227 106 C 234 100 248 98 259 101 C 271 104 278 116 276 130 C 273 149 256 163 234 163 C 228 163 224 161 222 160 L 214 196 C 213 200 207 201 204 198 C 202 196 202 195 203 194 Z M 225 152 C 230 154 237 154 243 151 C 255 146 261 133 262 124 C 263 115 258 109 250 109 C 243 109 237 112 233 117 C 230 120 228 131 225 152 Z" />
      </g>

      {/* 'R' in Royal Blue */}
      <g fill="#114C9E">
        <path d="M 283 192 C 285 183 293 148 298 124 C 300 115 304 107 312 104 C 322 100 338 102 344 112 C 348 119 346 131 337 141 C 330 148 322 151 316 152 C 322 155 329 164 332 174 C 335 184 340 189 346 189 C 349 189 352 187 353 186 C 354 188 352 192 349 194 C 342 198 333 197 326 189 C 320 181 317 170 311 161 C 309 157 306 156 303 156 L 297 186 C 296 191 293 193 289 193 C 285 193 282 192 283 192 Z M 304 147 C 310 148 321 146 327 139 C 332 133 333 125 330 119 C 327 113 320 112 314 114 C 310 116 307 122 305 133 L 304 147 Z" />
      </g>

      {/* ================= 'Medical Academy' CURSIVE TEXT ================= */}
      <text
        x="232"
        y="228"
        textAnchor="middle"
        fill="#111827"
        fontFamily="'Brush Script MT', 'Dancing Script', 'Segoe Script', cursive"
        fontWeight="bold"
        fontSize="34"
        fontStyle="italic"
        letterSpacing="0.5"
      >
        Medical Academy
      </text>

      {/* ================= BOTTOM SLOGAN TEXT ================= */}
      {/* "Centre for Post-gRaduation (CPR)" */}
      <g
        fontFamily="'Times New Roman', Georgia, serif"
        fontWeight="bold"
        fontSize="17"
        letterSpacing="0.2"
      >
        {/* "Centre for " in Royal Blue */}
        <text x="62" y="306" fill="#114C9E">
          Centre for
        </text>
        {/* "Post-gRaduation" in Red */}
        <text x="148" y="306" fill="#E21B23">
          Post-gRaduation
        </text>
        {/* " (CPR)" in Royal Blue */}
        <text x="287" y="306" fill="#114C9E">
          (CPR)
        </text>
      </g>
    </svg>
  );
};
