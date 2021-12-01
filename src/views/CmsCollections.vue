<template>
  <div class="px-6 pb-4 max-width-1600 mx-auto">
    <HelloWorld
      v-if="isWelcomeScreen"
      class="text-center mt-4"
      msg="Welcome to Cms Collections App"
    />
    <section
      v-if="isWelcomeScreen"
      class="flex flex-col justify-center items-center border-t border-b border-red mt-4 py-4"
    >
      <button
        class="btn btn--outline-blue my-2"
        v-if="!isLoading && !list && !isSearching"
        @click="loadData"
      >
        Fetch Collection Data
      </button>
      <div v-if="!list && isLoading" class="mt-2">
        <div class="flex items-center">
          Fetching cms collections list
          <SpinnerIcon class="ml-4" :size="24"/>
        </div>
        <div
          class="my-2 text-xs text-light-grey"
          v-for="i in fetchingSequence"
          :key="i"
        >
          ✅ {{i}}
        </div>
      </div>
    </section>
    <nav
      class="flex items-start pt-8 px-6 -mx-6"
      :class="{
        'sticky top-0 bg-white z-1': !!list 
      }"
    >
      <article class="overflow-x-auto mr-4 flex-1">
        <ul class="flex items-center list-none text-sm pl-0" v-if="list">
          <li class="font-bold text-sm flex items-center mr-2">Collections  ➡️</li>
          <li
            v-for="(item, key) in list"
            :key="key"
            class="flex items-center border rounded capitalize py-1 px-2 mr-4"
            :class="[
              index === key.toString() ?
              'border-blue pointer-events-none bg-light-blue':
              'cursor-pointer border-light-grey hover:bg-light-blue',
              {
                'pointer-events-none': isSearching
              }
            ]"
            @click="() => {
              jumptoIndex(key.toString())
            }"
          >
            {{ apiCollection[key].label }}
            <small class="text-blue ml-1 leading-none">
              ({{ item.count }})
            </small>
            <SpinnerIcon
              class="ml-1"
              v-if="
                isSearching &&
                isSearching.type === searchMsg.JUMP.type &&
                jumpIndex === key.toString()
              "
              :size="14"
            />
          </li>
        </ul>
      </article>
      <article
        class="inline-block pb-5"
        v-if="list || isSearching"
        :style="{transform:'translateY(-7px)'}"
      >
        <div
          class="flex items-center border border-grey rounded p-1 text-sm"
          :class="{'bg-light-grey opacity-75': isSearching}"
        >
          <label for="s-input" class="p-1 pr-0">🔎</label>
          <input
            id="s-input"
            v-model.trim="searchKeyword"
            @focus="clearError"
            @blur="clearError"
            type="text"
            placeholder="Search property keyword"
            class="outline-none p-1 w-200 bg-transparent"
            :disabled="isSearching || showSearchHeader"
          />
          <button
            v-if="!showSearchHeader"
            class="btn btn--blue btn--sm ml-1 w-90"
            @click="fetchKeywordData"
            :disabled="isSearching"
          >
            <SpinnerIcon
              v-if="isSearching && isSearching.type === searchMsg.SEARCH.type"
              :size="16"
            />
            <span v-else>Search</span>
          </button>
          <button
            v-else
            class="btn btn--outline-blue btn--sm ml-1 w-90"
            @click="clearKeywordData"
            :disabled="isSearching"
          >
            <SpinnerIcon
              v-if="isSearching && isSearching.type === searchMsg.CLEAR.type"
              :size="16"
            />
            <span v-else>Clear</span>
          </button>
        </div>
        <small class="text-red text-xxs w-full absolute mt-1" v-if="error" v-html="error"></small>
      </article>
    </nav>
    <section
      v-if="isSearching"
      class="flex items-center justify-center text-grey min-h-400"
    >
      {{ isSearching.msg }}
      <SpinnerIcon class="ml-2" :size="16"/>
    </section>
    <main
      v-if="list && !isSearching"
      class="word-break w-full mb-4 text-sm"
    >
      <header class="sticky z-1 header-top bg-white py-4 border-b border-light-grey -mx-6 px-6 mb-4">
        <div v-if="showSearchHeader" class="w-full mb-2 text-sm">
          💬 Showing results for searched keyword: <strong>{{ searchKeyword }}</strong>
        </div>
        <article class="flex items-center justify-between">
          <h2 class="capitalize flex items-center m-0">
            &#128073; {{ indexedList.label }}
            <small class="text-blue mx-2" :style="{lineHeight:'inherit'}">
              ({{ indexedList.total }})
            </small>
            <small v-if="indexedList.occuranceCount" class="text-light-grey">
              Keyword occurance: {{ indexedList.occuranceCount }}
            </small>
          </h2>
          <div class="text-sm flex items-center" v-if="indexedList.total">
            {{ indexedList.pageLabel }}
            <button
              title="Previous"
              class="btn btn--outline-blue border-black btn-sm p-0 ml-2"
              :class="{
                'pointer-events-none opacity-25': !indexedList.prePage
              }"
              @click="jumptoPageIndex(indexedList.prePage)"
            >
              <img class="rotate-90" src="@/assets/images/chevron-down.svg" alt="prev">
            </button>
            <button
              title="Next"
              class="btn btn--outline-blue border-black btn-sm p-0 ml-2"
              :class="{
                'pointer-events-none opacity-25': !indexedList.nextPage
              }"
              @click="jumptoPageIndex(indexedList.nextPage)"
            >
              <img class="rotate-270" src="@/assets/images/chevron-down.svg" alt="next">
            </button>
          </div>
        </article>
      </header>
      <DataList
        v-for="(data, i) in indexedList.data"
        :key="data.id"
        :data="data"
        :index="indexedList.startIndex + i"
        :api="apiCollection[index]"
        @open-preview="showPreviewModal"
      />
    </main>
    <Modal class="modal--preview" ref="modalName">
      <template v-slot:header>
        <header>
          <h4 class="capitalize text-lg" v-if="modal" v-html="modal.title"></h4>
          <button
            class="btn btn--outline-green py-0 px-1 text-sm"
            @click="$refs.modalName.highlightAttributes()">
              {{ $refs.modalName.highlightAttrs ? 'Remove Highlighting': 'Highlight Attributes' }}
          </button>
        </header>
      </template>

      <template v-slot:body>
        <div v-if="modal" v-html="modal.body" @click.prevent="onBodyClick"></div>
      </template>

      <template v-slot:footer>
        <div>
          <button
            class="btn btn--outline-blue btn--sm"
            @click="$refs.modalName.closeModal()">
            Cancel
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
// @ts-nocheck
import axios from "axios";
// @ is an alias to /src
import SpinnerIcon from "@/components/SpinnerIcon.vue";
import DataList from "@/components/DataList.vue";
import Modal from "@/components/Modal.vue";
import HelloWorld from "@/components/HelloWorld.vue";
const BASE_URL = 'https://paytminsurance.co.in'

export default {
  name: "CmsCollections",
  components: {
    SpinnerIcon,
    DataList,
    Modal,
    HelloWorld
  },
  data () {
    return {
      index: '',
      pageIndex: 1,
      error: '',
      searchKeyword: '',
      fetchingSequence: [],
      isLoading: false,
      isSearching: null,
      searchMsg: {
        SEARCH: {msg: 'Searching in cms collections list', type: 'search'},
        CLEAR: {msg: 'Clearing Search...', type: 'clear'},
        JUMP: {msg: 'Switching to in cms collections list', type: 'jump_to'},
      },
      isWelcomeScreen: true,
      jumpIndex: null,
      showSearchHeader: false,
      list: null,
      fetchedlist: null,
      apiCollection: {
        articles: {
          label:'Articles',
          api:'https://cms.paytminsurance.co.in/articles?_limit=-1',
          urlProps: {baseUrl:BASE_URL, prop:'path'}
        },
        pages: {
          label:'Pages',
          api:'https://cms.paytminsurance.co.in/pages?_limit=-1',
          urlProps: {baseUrl:`${BASE_URL}/`, prop:'path'}
        },
        insuranceCompanies: {
          label:'Insurance Companies',
          api:'https://cms.paytminsurance.co.in/insurance-company-pages?_limit=-1',
          urlProps: {baseUrl:`${BASE_URL}/insurance-companies/`, prop:'insurance_company.slug'}
        },
      },
      modal: null
    }
  },
  methods: {
    async loadData () {
      const { apiCollection } = this.$data
      const lst = {}
      this.isLoading = true
      for (const item in apiCollection) {
        this.fetchingSequence = [...this.fetchingSequence, `Fetching ${apiCollection[item].label} data...`]
        await axios
          .get(apiCollection[item].api)
          .then(resp => {
            lst[item] = {
              data: resp.data,
              count: resp.data.length,
            }
          })
      }
      this.list = lst
      this.fetchedlist = this.deepCopyObject(lst)
      this.isLoading = false
      this.fetchingSequence = []
      this.index = Object.keys(this.list)[0]
      this.isWelcomeScreen = false
    },
    clearError() {
      this.error = ''
    },
    getCaseInsensitiveRegx(v) {
      const w = v.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
      return new RegExp(w, "ig")
    },
    countWordOccurance(string, word) {
      return string.split(this.getCaseInsensitiveRegx(word)).length -1
    },
    deepCopyObject(object) {
      return JSON.parse(JSON.stringify(object))
    },
    gotoIndex(refName) {
      this.index = refName
      window.scrollTo({top: 0, behavior: 'smooth'})
    },
    async jumptoIndex(refName) {
      const {msg, type} = this.searchMsg.JUMP
      this.isSearching = {
        msg: `${msg} ${this.apiCollection[refName].label || ''}`, 
        type
      }
      this.jumpIndex = refName
      await this.stall().then(() => {
        this.isSearching = null
        this.jumpIndex = null
        this.gotoIndex(refName)
        this.pageIndex = 1
      })
    },
    async jumptoPageIndex(index) {
      this.pageIndex = index
      window.scrollTo({top: 0, behavior: 'smooth'})
    },
    async clearKeywordData() {
      this.searchKeyword = ''
      this.list = null
      this.isSearching = this.searchMsg.CLEAR
      this.showSearchHeader = false
      await this.stall().then(() => {
        this.list = this.fetchedlist
        setTimeout(() => {
          this.isSearching = null
          this.gotoIndex(this.index || Object.keys(this.list)[0])
          this.pageIndex = 1
        }, 100)
      })
    },
    fetchKeywordData() {
      const search = this.searchKeyword.trim()
      if (!search) {
        this.error = 'Please add a search keyword'
        return
      }
      this.list = null
      this.isSearching = this.searchMsg.SEARCH
      this.showSearchHeader = false
      this.getFilteredData(this.fetchedlist, search)
        .then((data) => {
          this.list = data
          setTimeout(() => {
            this.isSearching = null
            this.showSearchHeader = true
            this.gotoIndex(this.index || Object.keys(this.list)[0])
            this.pageIndex = 1
          }, 100)
        })
    },
    getFilteredData(list ,search) {
      return new Promise(resolve => {
        setTimeout(() => {
          const lst = {}
          for (const i in list) {
            let occuranceCount = 0
            const fData = list[i].data.reduce((result, item) => {
              let keyOccurance = 0
              const keyFilterCount = {}
              const newItem = {}
              for (const prop in item) {
                let itemProp = JSON.stringify(item[prop])
                const count = this.countWordOccurance(itemProp, search)
                if (count) {
                  keyFilterCount[prop] = count
                  keyOccurance = keyOccurance + count
                  itemProp = itemProp.replaceAll(this.getCaseInsensitiveRegx(search), '⛔$&')
                }
                newItem[prop] = JSON.parse(itemProp)
              }
              if (keyOccurance) {
                result.push({...newItem, keyFilterCount})
                occuranceCount = occuranceCount + keyOccurance
              }
              return result
            },[])

            lst[i] = {
              data: fData,
              count: fData.length,
              occuranceCount
            }
          }
          resolve(lst)
        }, 2000)
      })
    },
    showPreviewModal({field, html}) {
      this.modal = { title: field, body: html }
      this.$refs.modalName.openModal()
    },
    async stall(stallTime = 2000) {
      await new Promise(resolve => setTimeout(resolve, stallTime))
    },
    paginator(items, currentPage, perPageItems) {
      const page = currentPage || 1,
      perPage = perPageItems || 10,
      offset = (page - 1) * perPage,
      paginatedItems = items.slice(offset).slice(0, perPageItems),
      totalPages = Math.ceil(items.length / perPage)

      return {
        page: page,
        perPage,
        prePage: page - 1 ? page - 1 : null,
        nextPage: (totalPages > page) ? page + 1 : null,
        total: items.length,
        totalPages: totalPages,
        data: paginatedItems
      }
    },
    onBodyClick(e) {
      e.preventDefault();
    },
  },
  computed: {
    indexedList() {
      const {index, apiCollection, list, pageIndex} = this.$data
      if (list && index && pageIndex) {
        const {total, page, perPage, data, ...rest} = this.paginator(list[index].data, pageIndex, 50)
        const multiplierCount = (page - 1)*perPage
        return {
          ...rest,
          total,
          page,
          perPage,
          data,
          label: apiCollection[index].label,
          keywordCount: list[index].occuranceCount,
          pageLabel: `Showing: ${multiplierCount + 1} - ${data.length + multiplierCount} of ${total}`,
          startIndex: multiplierCount + 1
        }
      }
      return null
    }
  },
};
</script>
<style lang="postcss">
  .dl pre {
    font: inherit;
    word-break: break-word;
    white-space: pre-wrap;
  }
  .dl:last-child {
    border-bottom: none !important;
  }
  .max-h-data {
    max-height: 800px;
  }
  .min-h-400 {
    min-height: 400px;
  }
  .c-preview {
    flex-shrink: 0;
    font-size: 12px;
    padding: 4px;
    cursor: pointer;
  }
  .size-pulse {
    background-color: #efebf5;
    border-radius: 100%;
    width: 100vw;
    height: 100vw;
  }
  .header-top {
    top: 93px;
  }
  .max-width-1600 {
    max-width: 1600px;
  }
</style>