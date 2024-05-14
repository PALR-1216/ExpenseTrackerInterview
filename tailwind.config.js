/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    './node_modules/preline/preline.js',
    "./node_modules/flowbite/**/*.js"

  ],
  theme: {
    extend: {
      colors:{
        LogoGreen:"#47a15e"
      }
    },
  },
  plugins: [
    require('preline/plugin'),
    require('flowbite/plugin')({
      charts:true

    }),
    require('daisyui')
  ],
}