import { getDictList } from '@/api/common'
const common = {
  state: {
    dictList: null
  },
  mutations: {
    SET_DICT_LIST: (state, dictList) => {
      state.dictList = dictList
    }
  },

  actions: {
    // 获取并设置字典列表值
    getDictData({ commit }) {
      return new Promise((resolve, reject) => {
        getDictList().then(res => {
          commit('SET_DICT_LIST', res.data)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default common
