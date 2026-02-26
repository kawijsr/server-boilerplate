import {
  Configurations
} from '@kawijsr/server-node/dist/commons/configurations';

const manifest = (() => {
  try {
    return require('../../.assets/manifest.json')
  } catch (error) {
    console.warn(`manifest.json not found.`)
  }
  return {};
})();
export const hbsHelpers = {
  asset: (name: string) => {
    const assetsPath = Configurations.get('NODE_ENV') === 'local' ? '' : Configurations.get('R2_ASSETS_PATH')
    return assetsPath + (manifest[name] || name)
  }
}