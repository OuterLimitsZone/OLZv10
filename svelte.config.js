import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
// svelte.config.js
 
import { preprocessMeltUI, sequence } from '@melt-ui/pp'
 
const config = {
  // ... other svelte config options
  preprocess: sequence([
    // ... other preprocessors
    vitePreprocess(),
    preprocessMeltUI() // add to the end!
  ])
}
 
export default config