<template>
  <div class="list">
    <!-- 대피소 리스트 사이드바 컴포넌트 -->
    <b-sidebar id="sidebar-right" right no-header>
      <!-- 사이드바 내부 대피소 리스트 항목 동적 생성 -->
      <div class="sidebar-header">
        <b-button
        block
        v-b-toggle.sidebar-right.sidebar-no-header
        @click="hide"
        class="sm-4 custom-toggle"
      >
        <img src="../assets/circle-cross.png" alt="Map" width="20px" />
        </b-button>
        <p class="sidebar-tip">목록 클릭 시 상세정보/지도 안내</p>
      </div>
      
      <b-list-group>
        <div
          v-for="shelter in this.searchShelterList"
          v-bind:key="shelter.seqNum"
          @click="showModal(shelter.headCount, shelter.seqNum)"
        >
          <b-list-group-item href="#">
            <!-- 대피소명, 시설 번호 -->
            <div class="d-flex justify-content-between">
              <h5 class="mb-1">{{ shelter.name }}</h5>
              <small class="text-muted">No. {{ shelter.seqNum }}</small>
            </div>
            <!-- 대피소 정보 -->
            <div class="mt-3">
              <ul class="text-left">
                <li>주소 : {{ shelter.address }}</li>
                <li>면적 : {{ shelter.equiArea }} ㎡</li>
                <!--
                  <li v-if="shelter.headCount">수용인원 : {{ shelter.headCount }}</li>
                  <li v-if="shelter.type">활용목적 : {{ shelter.type }}</li>
                  <li v-if="shelter.isOpen">개방여부 : {{ shelter.isOpen }}</li>
                  <li v-if="shelter.date">데이터 갱신일자 : {{ shelter.date }}</li>
                  !-->
              </ul>
            </div>
          </b-list-group-item>
        </div>
      </b-list-group>
    </b-sidebar>
    <b-modal ref="my-modal" hide-footer title="대피소 정보" class="list-modal">
      <template #modal-header="{ close }">
        <!-- Emulate built in modal header close button action -->
        <h5 style="margin: auto 0">
          대피소 정보
        </h5>
        <b-button variant="" @click="close()" class="custom-toggle" size="xs">
          <img src="../assets/circle-cross.png" alt="Map" width="20px" />
        </b-button>
      </template>
      <!-- type 비어잇으면 지금은 지진정보임 -->
      <div v-if="this.searchShelterDetail.earthquakeDetail">
        <ul class="modal-list">
          <li>유형 : 지진/해일 대피소</li>
          <li>이름 : {{ searchShelterDetail.earthquakeDetail.name }}</li>
          <li>주소 : {{ searchShelterDetail.earthquakeDetail.address }}</li>
          <li>면적 : {{ searchShelterDetail.earthquakeDetail.equiArea }}㎡</li>
        </ul>

        <div class="map-link">
          <b-button
            variant="success"
            :href="searchNaverMapURL"
            target="_blank"
            rel="noopener noreferrer"
            >네이버 지도</b-button
          >
          <b-button
            variant="warning"
            :href="searchKakaoMapURL"
            target="_blank"
            rel="noopener noreferrer"
            >카카오 지도</b-button
          >
        </div>
      </div>

      <div v-if="this.searchShelterDetail.defenseDetail">
        <ul class="modal-list">
          <li>유형 : 민방위 대피소</li>

          <li>이름 : {{ searchShelterDetail.defenseDetail.name }}</li>
          <li>주소 : {{ searchShelterDetail.defenseDetail.address }}</li>
          <li>면적 : {{ searchShelterDetail.defenseDetail.equiArea }}㎡</li>
          <li>수용인원 : {{ searchShelterDetail.defenseDetail.headCount }}</li>
          <li>
            1인당 수용할수 있는 면적 :
            {{
              calparea(
                searchShelterDetail.defenseDetail.equiArea,
                searchShelterDetail.defenseDetail.headCount
              )
            }}㎡
          </li>
          <li>활용목적 : {{ searchShelterDetail.defenseDetail.type }}</li>
          <li>개방여부 : {{ searchShelterDetail.defenseDetail.isOpen }}</li>
          <li>
            데이터 갱신일자 : {{ searchShelterDetail.defenseDetail.date }}
          </li>
        </ul>
        <div class="map-link">
          <b-button
            variant="success"
            :href="searchNaverMapURL"
            target="_blank"
            rel="noopener noreferrer"
            >네이버 지도</b-button
          >
          <b-button
            variant="warning"
            :href="searchKakaoMapURL"
            target="_blank"
            rel="noopener noreferrer"
            >카카오 지도</b-button
          >
        </div>
      </div>
      <!-- type 비어잇지않으면 지금은 민방위정보임 -->
    </b-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      naverMapURL: "https://map.naver.com",
      kakaoMapURL: "https://map.kakao.com",
    };
  },
  name: "EvacList",
  computed: {
    // store에 저장된 검색으로 얻은 대피소 리스트 변화를 감지하기 위해 computed로 관리
    searchShelterList() {
      return this.$store.state.searchShelterList;
    },
    searchShelterDetail() {
      return this.$store.state.shelterDetail;
    },
    searchNaverMapURL() {
      this.setNaverMapURL();
      return this.naverMapURL;
    },
    searchKakaoMapURL() {
      this.setKakaoMapURL();
      return this.kakaoMapURL;
    },
  },
  methods: {
    setNaverMapURL() {
      if (this.searchShelterDetail.earthquakeDetail) {
        this.checkNaverMobileType(
          this.searchShelterDetail.earthquakeDetail.name
        );
      } else if (this.searchShelterDetail.defenseDetail) {
        this.checkNaverMobileType(this.searchShelterDetail.defenseDetail.name);
      }
      return this.naverMapURL;
    },
    setKakaoMapURL() {
      if (this.searchShelterDetail.earthquakeDetail) {
        this.checkKakaoMobileType(
          this.searchShelterDetail.earthquakeDetail.name
        );
      } else if (this.searchShelterDetail.defenseDetail) {
        this.checkKakaoMobileType(this.searchShelterDetail.defenseDetail.name);
      }
      return this.kakaoMapURL;
    },
    checkNaverMobileType(queryString) {
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.indexOf("android") > -1) {
        this.naverMapURL = `intent://search?query=${queryString}&appname=j6a403.p.ssafy.io#Intent;scheme=nmap;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.nhn.android.nmap;end`;
      } else if (
        userAgent.indexOf("iphone") > -1 ||
        userAgent.indexOf("ipad") > -1
      ) {
        this.naverMapURL = `nmap://search?query=${queryString}&appname=j6a403.p.ssafy.io`;
        this.naverMapURL = this.iosNaverMap(this.naverMapURL);
      } else {
        this.naverMapURL = `https://map.naver.com/search/${queryString}`;
      }
    },
    checkKakaoMobileType(queryString) {
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.indexOf("android") > -1) {
        this.kakaoMapURL = `intent://search?q=${queryString}#Intent;scheme=kakaomap;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=net.daum.android.map;end`;
      } else if (
        userAgent.indexOf("iphone") > -1 ||
        userAgent.indexOf("ipad") > -1
      ) {
        this.kakaoMapURL = `kakaomap://search?q=${queryString}`;
        this.kakaoMapURL = this.iosKakaoMap(this.kakaoMapURL);
      } else {
        this.kakaoMapURL = `https://map.kakao.com/link/search/${queryString}`;
      }
    },
    iosNaverMap(URL) {
      let clickedAt = +new Date();
      let returnURL = URL;

      setTimeout(() => {
        if (+new Date() - clickedAt < 2000) {
          returnURL = "http://itunes.apple.com/app/id311867728?mt=8";
        }
      }, 1500);

      return returnURL;
    },
    iosKakaoMap(URL) {
      let clickedAt = +new Date();
      let returnURL = URL;

      setTimeout(() => {
        if (+new Date() - clickedAt < 2000) {
          returnURL = "https://itunes.apple.com/app/id304608425?mt=8";
        }
      }, 1500);

      return returnURL;
    },
    calparea(area, headcount) {
      return Math.round((area / headcount) * 100) / 100;
    },
    showModal(type, seqNum) {
      // 모달오픈
      this.$refs["my-modal"].show();

      if (type == null) {
        this.DetailEarthquakes(seqNum)
          .then((res) => {
            // API 호출 결과로 얻은 대피소 정보를 store에 반영
            this.$store.commit("setDetailShelter", res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.DetailDefenses(seqNum)
          .then((res) => {
            // API 호출 결과로 얻은 대피소 정보를 store에 반영
            this.$store.commit("setDetailShelter", res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }

      console.log(type + " : " + seqNum);
    },
    async DetailEarthquakes(seqNum) {
      // return await this.$store.dispatch('searchEarthquakesByName', this.searchInput)            // 이름 검색
      return await this.$store.dispatch("searchEarthquakesBySeq", seqNum); // 지명 검색
    },
    async DetailDefenses(seqNum) {
      // return await this.$store.dispatch('searchEarthquakesByName', this.searchInput)            // 이름 검색
      return await this.$store.dispatch("searchDefensesBySeq", seqNum); // 지명 검색
    },
  },
};
</script>

<style>
#sidebar-right {
  margin: 170px auto 0;
  height: 68vh;
  width: 370px;
  text-align: left;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-content: center;
}

.sidebar-tip {
  margin: auto 5px;
}

::-webkit-scrollbar {
  width: 10px; /* 세로축 스크롤바 길이 */
  height: 20px; /* 가로축 스크롤바 길이 */
}
::-webkit-scrollbar-track {
  background-color: lightblue;
}
::-webkit-scrollbar-track-piece {
  background-color: rgb(196, 198, 199);
}
::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background-color: #ff4040;
}
::-webkit-scrollbar-corner {
  background-color: violet; /* 우측 하단의 코너 부분 */
}
::-webkit-resizer {
  background-color: green;
}

.map-link {
  margin-top: 5px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.text-left {
  list-style: none;
}

button.custom-toggle {
  background-color: #ffffff00;
  border-color: #ffffff00;
}

button.custom-toggle:hover {
  background-color: lightgrey;
  border-color: #ff404000;
}

.list-modal {
  position: absolute;
  top: 20%;
  right: 50%;
  z-index: 9999;
}

.modal-header .modal-title {
  margin: auto auto;
}
</style>
