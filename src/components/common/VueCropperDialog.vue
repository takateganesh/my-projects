<template>
  
<div>
        <v-dialog v-model="dialog" max-width="1000px">
          <v-card flat tile>
            <v-card-title>
              <v-row no-gutters>
                <v-col cols="11">
                  <p class="mb-1">Change avatar</p>
                </v-col>
                <v-col cols="1" class="text-right">
                  <router-link to class="text-decoration-none black--text">
                    <div @click="cancel()">X</div>
                  </router-link>
                </v-col>
              </v-row>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="mt-2">
              <v-row no-gutters>
                <v-col cols="12" sm="8">
                  <vueCropper
                    ref="cropper"
                    style="height:300px;"
                    :img="option.img"
                    :output-size="option.size"
                    :output-type="option.outputType"
                    :info="true"
                    :full="option.full"
                    :can-move="option.canMove"
                    :can-move-box="option.canMoveBox"
                    :fixed-box="option.fixedBox"
                    :original="option.original"
                    :auto-crop="option.autoCrop"
                    :auto-crop-width="option.autoCropWidth"
                    :auto-crop-height="option.autoCropHeight"
                    :center-box="option.centerBox"
                    :high="option.high"
                    :info-true="option.infoTrue"
                    :enlarge="option.enlarge"
                    :mode="option.mode"
                    @realTime="realTime"
                    @cropMoving="cropMoving"
                  ></vueCropper>
                </v-col>
                <v-col cols="12" sm="4" class="pl-3">
                  <section class="pre-item">
                    <p>Normal Preview</p>
                    <div
                      class="show-preview profileAvatar"
                      :style="{'width': previews.w + 'px', 'height': previews.h + 'px', 'overflow': 'hidden',
                               'margin': '5px'}"
                    >
                      <div :style="previews.div">
                        <img :src="previews.url" :style="previews.img" />
                      </div>
                    </div>
                  </section>

                  <section class="pre-item">
                    <p>Small preview</p>
                    <div class="profileAvatar" :style="previewStyle1">
                      <div :style="previews.div">
                        <img :src="previews.url" :style="previews.img" />
                      </div>
                    </div>
                  </section>

                  <p>Icon preview</p>
                  <div class="profileAvatar" :style="previewStyle2">
                    <div :style="previews.div">
                      <img :src="previews.url" :style="previews.img" class="profileAvatar" />
                    </div>
                  </div>
                </v-col>
              </v-row>

              <v-divider class="mt-2"></v-divider>

              <v-row no-gutters>
                <v-col cols="12" sm="4" class="pa-2">
                  <input
                    id="uploads"
                    type="file"
                    class="file-input"
                    label="Image"
                    accept="image/png, image/jpeg, image/gif, image/jpg"
                    @change="uploadImg($event, 1)"
                  />
                </v-col>
                <v-col cols="12" sm="8">
                  <v-btn-toggle class="ma-2" borderless>
                    <v-btn class="apps-route-button px-0 px-sm-3" @click="changeScale(1.5)">
                      <v-icon color="purple darken-2">mdi-magnify-plus</v-icon>
                    </v-btn>
                    <v-btn class="apps-route-button px-0 px-sm-3" @click="changeScale(-1.5)">
                      <v-icon color="purple darken-2">mdi-magnify-minus</v-icon>
                    </v-btn>
                  </v-btn-toggle>
                  <v-btn-toggle class="ma-2" borderless>
                    <v-btn class="apps-route-button px-0 px-sm-3" @click="rotateLeft()">
                      <v-icon color="purple darken-2">mdi-undo-variant</v-icon>
                    </v-btn>
                    <v-btn class="apps-route-button px-0 px-sm-3" @click="rotateRight()">
                      <v-icon color="purple darken-2">mdi-redo-variant</v-icon>
                    </v-btn>
                  </v-btn-toggle>
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="py-3">
              <v-row no-gutters>
                <v-col cols="12" class="text-right">
                  <v-btn class="mx-2" tile @click="cancel()">Cancel</v-btn>
                  <v-btn class="text-uppercase" color="primary" tile @click="onSubmit">OK</v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-dialog>
     </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'

export default {
  name: 'VueCropperWidget',
  components: { VueCropper },
  props:["showAvtarDialog"], 
  data: function() {
    return {
      previews: {},
      dialog: this.showAvtarDialog,
      previewStyle1: {},
      previewStyle2: {},
      option: {
        img: '',
        size: 1,
        full: false,
        outputType: 'png',
        canMove: true,
        fixed: true,
        fixedBox: true,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        autoCropWidth: 128,
        autoCropHeight: 128,
        centerBox: false,
        high: true,
        cropData: {},
        enlarge: 1,
        mode: 'contain'
      }
    }
  },
  methods: {

    uploadImg(e, num) {
      //上传图片
      // this.option.img
      // eslint-disable-next-line prefer-destructuring
      const file = e.target.files[0]

      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')

        return false
      }
      const reader = new FileReader()

      reader.onload = (e) => {
        let data

        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }
        if (num === 1) {
          this.option.img = data
        } else if (num === 2) {
          this.example2.img = data
        }
      }

      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blob
      return reader.readAsArrayBuffer(file)
    },
    startCrop() {
      // start
      this.crap = true
      this.$refs.cropper.startCrop()
    },
    stopCrop() {
      //  stop
      this.crap = false
      this.$refs.cropper.stopCrop()
    },
    clearCrop() {
      // clear
      this.$refs.cropper.clearCrop()
    },
    refreshCrop() {
      // clear
      this.$refs.cropper.refresh()
    },
    changeScale(num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    rotateLeft() {
      this.$refs.cropper.rotateLeft()
    },
    rotateRight() {
      this.$refs.cropper.rotateRight()
    },
    realTime(data) {
      const previews = data

      const h = 0.5
      const w = 0.2

      this.previewStyle1 = {
        width: previews.w + 'px',
        height: previews.h + 'px',
        overflow: 'hidden',
        margin: '0',
        zoom: h
      }
      this.previewStyle2 = {
        width: previews.w + 'px',
        height: previews.h + 'px',
        overflow: 'hidden',
        margin: '0',
        zoom: w
      }
      this.previews = data
    },

    cropMoving(data) {
      this.option.cropData = data
    },
     cancel() {      
      this.$emit('closeAvtarDialogAction')
    },
    onSubmit() {
      this.$emit('submitAvtarChangeAction')
    }
  }
}
</script>
