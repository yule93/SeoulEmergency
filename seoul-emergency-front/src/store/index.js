import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate';


Vue.use(Vuex)

axios.defaults.headers['Content-Type'] = 'application/json'
const backAxios = axios.create({
  baseURL: '/api'
})

export default new Vuex.Store({
  state: {
    category: "",
    options: [
      { value: "", text: "대피소 종류 선택"},
      { value: "지진", text: "지진"},
      { value: "해일", text: "해일"},
      { value: "민방위", text: "민방위"}
    ],
    searchShelterList: [],      // 검색 API로 얻은 대피소 리스트
    newsList: [
      {
        id: 0,
        newsTitle: "example",
        newsLink: "",
        newsContent: "example"
      }
    ],   // 뉴스 API로 얻은 재난 뉴스 리스트
    isSearch: false,
    shelterDetail:[],
  },
  getters: {
    // 대피소 리스트 getter
    getSearchShelterList(state) {
      return state.searchShelterList
    },
    // 재난 뉴스 리스트 getter
    getDisasterNewsList(state) {
      return state.newsList;
    }
  },
  mutations: {
    // 대피소 리스트 setter
    setSearchShelterList(state, searchShelterList) {
      state.searchShelterList = []
      state.searchShelterList = searchShelterList
    },
    // 대피소 분류 setter
    SET_CATEGORY(state, category) {
      state.category = category;
    },
    setDetailShelter(state, shelterDetail) {
      state.shelterDetail = []
      state.shelterDetail = shelterDetail
    },

    SET_NEWS_LIST(state, newsList) {
      state.newsList = newsList
    }
  },
  actions: {
    // 지진 옥외 대피소 지역명 검색 axios
    searchEarthquakesByArea({state}, payload) {
      console.log('searchEarthquakesByArea', state, payload);
      const url = `/api/shelters/areasearch/earthquakes/${payload}`
      return backAxios.get(url)
    },
    // 지진 옥외 대피소 이름 검색 axios
    searchEarthquakesByName({state}, payload) {
      console.log('searchEarthquakesByName', state, payload);
      const url = `/api/shelters/namesearch/earthquakes/${payload}`
      return backAxios.get(url)
    },
    // 해일 대피소 지역명 검색 axios
    searchTsunamisByArea({state}, payload) {
      console.log('searchTsunamisByArea', state, payload);
      const url = `/api/shelters/areasearch/tsunamis/${payload}`
      return backAxios.get(url)
    },
    // 해일 대피소 이름 검색 axios
    searchTsunamisByName({state}, payload) {
      console.log('searchTsunamisByName', state, payload);
      const url = `/api/shelters/namesearch/tsunamis/${payload}`
      return backAxios.get(url)
    },
    // 민방위 대피소 지역명 검색 axios
    searchDefensesByArea({state}, payload) {
      console.log('searchDefensesByArea', state, payload);
      const url = `/api/shelters/areasearch/defenses/${payload}`
      return backAxios.get(url)
    },
    // 민방위 대피소 이름 검색 axios
    searchDefensesByName({state}, payload) {
      console.log('searchDefensesByName', state, payload);
      const url = `/api/shelters/namesearch/defenses/${payload}`
      return backAxios.get(url)
    },

    // 거리순 지진 옥외 대피소 검색 axios
    searchNearestEarthquakes({state}, location) {
      console.log('거리순 지진 옥외 대피소 검색', state);
      const url = '/api/shelters/list/earthquakes';
      return backAxios.get(url, {
        params: location,
      });
    },
    // 거리순 해일 대피소 검색 axios
    searchNearestTsunamis({state}, location) {
      console.log('거리순 해일 대피소 검색', state);
      const url = '/api/shelters/list/earthquakes';
      return backAxios.get(url, {
        params: location,
      });
    },
    // 거리순 민방위 대피소 검색 axios
    searchNearestDefenses({state}, location) {
      console.log('거리순 민방위 대피소 검색', state);
      const url = '/api/shelters/list/defenses';
      return backAxios.get(url, {
        params: location,
      });
    },

    // SeqNum으로 지진 대피소검색
    searchEarthquakesBySeq({state}, payload) {
      console.log('searchEarthquakesBySeq', state, payload);
      const url = `/api/shelters/detail/earthquakes/${payload}`
      return backAxios.get(url)
    },
      // SeqNum으로 민방위 대피소검색
    searchDefensesBySeq({state}, payload) {
      console.log('searchDefensesBySeq', state, payload);
      const url = `/api/shelters/detail/defenses/${payload}`
      return backAxios.get(url)
    },

    // 뉴스 리스트 페이지로 불러오기
    getNewsListByPage({ state }, {page, limit}) {
      console.log('뉴스 리스트 페이지 별 불러오기', state.newsList);
      const url = `/api/news/list/page`;
      return backAxios.get(url, {
        params: {
          page: page,
          limit: limit
        }
      });
    }
  },
  modules: {
  },
  plugins: [
    createPersistedState(),
  ]
})