export default {
  namespaced: true,
  state: {
    stack: [],
    hidden: false,
  },
  mutations: {
    setStack: (state, value) => {
      state.stack = value;
    },
    setHidden: (state, value) => {
      state.hidden = value;
    },
  },
  getters: {
    config: state => !state.hidden && state.stack[0],
  },
  actions: {
    open({ commit, state }, param) {
      return new Promise((resolve, reject) => {
        const config = typeof param === 'object' ? { ...param } : { type: param };
        const clean = () => commit('setStack', state.stack.filter((otherConfig => otherConfig !== config)));
        config.resolve = (result) => {
          clean();
          if (config.onResolve) {
            // Call onResolve immediately (mostly to prevent browsers from blocking popup windows)
            config.onResolve(result)
              .then(res => resolve(res));
          } else {
            resolve(result);
          }
        };
        config.reject = (error) => {
          clean();
          reject(error);
        };
        commit('setStack', [config, ...state.stack]);
      });
    },
    hideUntil({ commit, state }, promise) {
      commit('setHidden', true);
      return promise.then((res) => {
        commit('setHidden', false);
        return res;
      }, (err) => {
        commit('setHidden', false);
        throw err;
      });
    },
    folderDeletion: ({ dispatch }, item) => dispatch('open', {
      content: `<p>您将要删除文件夹 <b>${item.name}</b>. 它的文件将被移到垃圾桶. 你确定吗?</p>`,
      resolveText: '确认, 删除',
      rejectText: '不',
    }),
    tempFileDeletion: ({ dispatch }, item) => dispatch('open', {
      content: `<p>您将要永久删除临时文件 <b>${item.name}</b>. 你确定吗?</p>`,
      resolveText: '确认, 删除',
      rejectText: '不',
    }),
    tempFolderDeletion: ({ dispatch }) => dispatch('open', {
      content: '<p>Y您将要永久删除所有临时文件. 你确定吗?</p>',
      resolveText: '确认, 删除所有',
      rejectText: '不',
    }),
    discussionDeletion: ({ dispatch }) => dispatch('open', {
      content: '<p>你将要删除一个讨论. 你确定?</p>',
      resolveText: '确认, 删除',
      rejectText: '不',
    }),
    commentDeletion: ({ dispatch }) => dispatch('open', {
      content: '<p>您即将删除一条评论. 你确定吗?</p>',
      resolveText: '确认, 删除',
      rejectText: '不',
    }),
    trashDeletion: ({ dispatch }) => dispatch('open', {
      content: '<p>在不活动7天之后. 垃圾中的文件会自动删除. </p>',
      resolveText: '好的',
    }),
    fileRestoration: ({ dispatch }) => dispatch('open', {
      content: '<p>你即将恢复一些变化. 你确定吗?</p>',
      resolveText: '是的, 恢复',
      rejectText: '不',
    }),
    removeWorkspace: ({ dispatch }) => dispatch('open', {
      content: '<p>您将要在本地删除工作区. 你确定吗?</p>',
      resolveText: '是的, 删除',
      rejectText: '不',
    }),
    reset: ({ dispatch }) => dispatch('open', {
      content: '<p>这将在本地清理您的所有工作区. 你确定吗?</p>',
      resolveText: '是的, 清除',
      rejectText: '不',
    }),
    providerRedirection: ({ dispatch }, { providerName, onResolve }) => dispatch('open', {
      content: `<p>您将导航到 <b>${providerName}</b> 授权页.</p>`,
      resolveText: '好的, 继续',
      rejectText: '取消',
      onResolve,
    }),
    workspaceGoogleRedirection: ({ dispatch }, { onResolve }) => dispatch('open', {
      content: '<p>StackEdit 需要完整的谷歌驱动器访问来打开这个工作区.</p>',
      resolveText: '好的, 授予',
      rejectText: '取消',
      onResolve,
    }),
    signInForSponsorship: ({ dispatch }, { onResolve }) => dispatch('open', {
      type: 'signInForSponsorship',
      content: `<p>你必须和谷歌签约.</p>
      <div class="modal__info"><b>注:</b> 这将同步您的主工作区.</div>`,
      resolveText: '好的, 登录',
      rejectText: '取消',
      onResolve,
    }),
    signInForComment: ({ dispatch }, { onResolve }) => dispatch('open', {
      content: `<p>你必须登录谷歌开始评论.</p>
      <div class="modal__info"><b>Note:</b> 这将同步你的主工作空间.</div>`,
      resolveText: '好的, 登录',
      rejectText: '取消',
      onResolve,
    }),
    signInForHistory: ({ dispatch }, { onResolve }) => dispatch('open', {
      content: `<p>您必须与谷歌签定以启用修订历史.</p>
      <div class="modal__info"><b>Note:</b> 这将同步你的主工作空间.</div>`,
      resolveText: '好的, 登录',
      rejectText: '取消',
      onResolve,
    }),
    sponsorOnly: ({ dispatch }) => dispatch('open', {
      content: '<p>他的特点仅限于赞助商. 因为它依赖于服务器资源。.</p>',
      resolveText: '好的, 我明白了',
    }),
    paymentSuccess: ({ dispatch }) => dispatch('open', {
      content: '<p>感谢您的支付! 你的赞助活动将在一分钟内生效。.</p>',
      resolveText: '好的',
    }),
  },
};
