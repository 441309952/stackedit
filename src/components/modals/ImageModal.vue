<template>
  <modal-inner aria-label="Insert image">
    <div class="modal__content">
      <p>请为您的图片提供 <b>URL</b>.</p>
      <form-entry label="URL" error="url">
        <input slot="field" class="textfield" type="text" v-model.trim="url" @keydown.enter="resolve()">
      </form-entry>
      <menu-entry @click.native="openGooglePhotos(token)" v-for="token in googlePhotosTokens" :key="token.sub">
        <icon-provider slot="icon" provider-id="googlePhotos"></icon-provider>
        <div>Open from Google Photos</div>
        <span>{{token.name}}</span>
      </menu-entry>
      <menu-entry @click.native="addGooglePhotosAccount" v-if="fasle">
        <icon-provider slot="icon" provider-id="googlePhotos"></icon-provider>
        <span>Add Google Photos account</span>
      </menu-entry>
    </div>
    <div class="modal__button-bar">
      <button class="button" @click="reject()">取消</button>
      <button class="button" @click="resolve()">好的</button>
    </div>
  </modal-inner>
</template>

<script>
import modalTemplate from './common/modalTemplate';
import MenuEntry from '../menus/common/MenuEntry';
import googleHelper from '../../services/providers/helpers/googleHelper';

export default modalTemplate({
  components: {
    MenuEntry,
  },
  data: () => ({
    url: '',
  }),
  computed: {
    googlePhotosTokens() {
      const googleTokens = this.$store.getters['data/googleTokens'];
      return Object.entries(googleTokens)
        .map(([, token]) => token)
        .filter(token => token.isPhotos)
        .sort((token1, token2) => token1.name.localeCompare(token2.name));
    },
  },
  methods: {
    resolve() {
      if (!this.url) {
        this.setError('url');
      } else {
        const callback = this.config.callback;
        this.config.resolve();
        callback(this.url);
      }
    },
    reject() {
      const callback = this.config.callback;
      this.config.reject();
      callback(null);
    },
    addGooglePhotosAccount() {
      return googleHelper.addPhotosAccount();
    },
    openGooglePhotos(token) {
      const callback = this.config.callback;
      this.config.reject();
      googleHelper.openPicker(token, 'img')
        .then(res => res[0] && this.$store.dispatch('modal/open', {
          type: 'googlePhoto',
          url: res[0].url,
          callback,
        }));
    },
  },
});
</script>
