function ManifestCreate(options) {
  const defaults = {
    'name': 'Webpack App',
    'short_name': 'W-App',
    'start_url': '.',
    'display': 'standalone',
    'background_color': '#fff',
    'description': 'A webpack built project',
    'iconsPath': false
  };

  this.options = Object.assign(defaults, options);

  if (this.options.iconsPath && typeof this.options.iconsPath === 'string') {
    this.options.icons = [];
    const icons = ['36x36', '48x48', '72x72', '96x96', '144x144', '192x192', '256x256', '384x384', '512x512'];

    this.options.icons = icons.map((i) => {
      return {
        'src': `${this.options.iconsPath}android-chrome-${i}.png`,
        'sizes': i,
        'type': 'image/png'
      };
    });
  }

  delete this.options.iconsPath;
  delete this.options.appId;
}

ManifestCreate.prototype.apply = function ManifestCreateApply(compiler) {
  compiler.plugin('emit', (compilation, callback) => {
    compilation.assets['manifest.json'] = {
      source: () => {
        return JSON.stringify(this.options);
      },
      size: () => {
        return 0;
      }
    };
    callback();
  });
};

module.exports = ManifestCreate;
