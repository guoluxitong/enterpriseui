<template>
  <div>
  <div v-if="!deviceTypeVisible" class="app-container">
    <el-row class="app-query">
      <el-form :model="deviceForm" :rules="rules" ref="deviceListFormData">
      <el-col :span="3">
        <el-form-item prop="customerName">
        <el-autocomplete
          v-model="deviceForm.customerName"
          :fetch-suggestions="querySearchAsyncuser2"
          placeholder="企业客户"
          @select="((item)=>{handleSelectuser2(item)})"
        ></el-autocomplete>
        </el-form-item>
      </el-col>
      <el-col :span="3">
        <el-form-item prop="code">
        <el-autocomplete
          v-model="deviceForm.code"
          :fetch-suggestions="querySearchAsyncuser4"
          placeholder="客户编号"
          @select="((item)=>{handleSelectuser4(item)})"
        ></el-autocomplete>
        </el-form-item>
      </el-col>
      <el-col :span="2">
      <el-button  type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      </el-col>
      </el-form>
      <el-col :span="3">
        <el-button style="width: 140px" type="primary" icon="el-icon-search" @click="getDeviceList">查询全部设备</el-button>
      </el-col>
      <el-col :span="3">
      <el-input  style="width: 140px" clearable v-model="suffix" placeholder="设备编号"  ></el-input>
      </el-col>
      <el-col :span="2">
      <el-button  type="primary" icon="el-icon-search" @click="handleSuffixFilter">查询</el-button>
      </el-col>
    </el-row>
    <el-table :data="list.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 120%">
      <el-table-column align="left" :show-overflow-tooltip="true" label="设备编号">
        <template slot-scope="scope">
          <span>{{scope.row.deviceSuffix}}</span>
        </template>
      </el-table-column>
     <el-table-column  align="left" :show-overflow-tooltip="true"  label="加密编号">
        <template slot-scope="scope">
          <span>{{scope.row.deviceNo}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true" label="设备类型">
        <template slot-scope="scope">
          <span>{{scope.row.deviceType}}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="left" label="燃料">
        <template slot-scope="scope">
          <span>{{scope.row.power | dictionaryValueFieldFilter(fuelArray)}}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="left" label="介质">
        <template slot-scope="scope">
          <span>{{scope.row.media | dictionaryValueFieldFilter(mediumArray)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true"  label="导入时间">
        <template slot-scope="scope">
          <span>{{dateFormat(scope.row.importDatetime)}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange1"
        @current-change="handleCurrentChange1"
        :current-page="currentPage1"
        :page-sizes="[5]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="list.length"
      ></el-pagination>
    </div>
  </div>
  </div>
</template>
<script>
  import { initMedium, initFuel } from "./device-dictionary";
  import {formatDateTime} from '@/utils/date'
  import {getDeviceListByEnterpriseIdAndPage,getDeviceListByEnterpriseId,getDeviceListBySuffix,getDeviceListBycustom} from '@/api/device'
  import {getEnterpriseList,getCustomerlist,getCustomerPrefixList} from '@/api/enterprise'
  function dictionaryValueFilter(dictionaryValue, value) {
    const dictionaryValueItem = dictionaryValue.filter(item => {
      return item.value == value;
    });
    return dictionaryValueItem[0];
  }
  export default {
    data() {
      return {
        list:[],
        suffix:'',
        mediumArray: [],
        fuelArray: [],
        currentPage1: 1,
        pageNum1: 1,
        pageSize1: 5,
        deviceList:[],
        deviceNoList:{},
        enterpriseOption:[],
        customerOption:[],
        customerCodeOption:[],
        enterpriseList:{
          id:'',
          enterpriseName:''
        },
        customerCodeList:{
          code: '',
        },
        deviceForm:{
          code: '',
          customerName:''
        },
        customerList:{
          id:'',
          customerName:''
        },
        listQuery: {
          total:50,
          pageNum:1,
          pageSize:5,
         suffix:null,
          customerNo:null,
          enterpriseId:null,
          status:null,
          runStatus:null,
          saleDatetime:null
        },
        rules: {
          customerName: [{required: true, message: '客户名称不能为空', change: 'blur'}],
          code: [{ required: true, message: '客户编号不能为空', change: 'blur' }],
        },
        deviceTypeVisible:false,
        deviceFormData: {
          devicePrefix: '',
          deviceEndSuffix:'',
         status: '',
          power: '',
          media: '',
          enterpriseId:'',
          deviceType:'',
          deviceSuffix:'',
          subType:'',
          deviceNo:'',
        },
        listLoading:false
      }
    },
    filters: {
      dictionaryValueFieldFilter(value, dictionaryValueArray) {
        if (dictionaryValueFilter(dictionaryValueArray, value))
          return dictionaryValueFilter(dictionaryValueArray, value).label;
        return;
      }
    },
    created() {
     this.inintselect()
    },
    methods: {
      dateFormat: function(time) {
        var date = new Date(time);
        var year = date.getFullYear();
        /* 在日期格式中，月份是从0开始的，因此要加0
         * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
         * */
        var month =
          date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1;
        var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var hours =
          date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var minutes =
          date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var seconds =
          date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        // 拼接
        return (
          year +
          "-" +
          month +
          "-" +
          day +
          " " +
          hours +
          ":" +
          minutes +
          ":" +
          seconds
        );
      },
      inintselect(){
        getCustomerlist(this.$store.state.user.token.orgId).then(response => {
          this.customerOption=response.data.data;
        });
        initMedium().then(data => {
          this.mediumArray = data;
        });
        initFuel().then(data => {
          this.fuelArray = data;
        });
      },
      querySearchAsyncuser2(queryString, callback) {
        var results = [];
        for (let i = 0, len = this.customerOption.length; i < len; i++) {
          this.customerOption[i].value = this.customerOption[i].customerName;
        }
        this.customerList=this.customerOption;
        results = queryString ? this.customerList.filter(this.createFilteruser2(queryString)) : this.customerList;
        callback(results);
      },

      createFilteruser2(queryString, queryArr) {
        return (queryArr) => {
          return (queryArr.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelectuser2(item) {
        this.customerList.id = item.id;
        this.getCustomerPrefixList()
      },
      getCustomerPrefixList() {
        getCustomerPrefixList(this.customerList.id).then(response => {
            this.customerCodeOption=response.data.data;
        })
      },
      querySearchAsyncuser4(queryString, callback) {
        var results = [];
        for (let i = 0, len =this.customerCodeOption.length; i < len; i++) {
          this.customerCodeOption[i].value = this.customerCodeOption[i].code;
        }
        this.customerCodeList = this.customerCodeOption;
        results = queryString ? this.customerCodeList.filter(this.createFilteruser4(queryString)) : this.customerCodeList;
        callback(results);
      },

      createFilteruser4(queryString, queryArr) {
        return (queryArr) => {
          return (queryArr.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelectuser4(item) {
      },
      handleFilter() {
        this.$refs.deviceListFormData.validate(valid => {
          if (valid) {
            this.currentPage1 = 1;
            this.getList()
          }else {
            return false
          }
        })
      },
      getList() {
        this.listLoading = true;
        getDeviceListBycustom(this.deviceForm.code).then(response => {
          if(response.data.code==0){
          this.list=response.data.data;
          this.listLoading = false
          }else{
            this.$message.error(response.data.msg);
            this.listLoading = false;
            return;
          }
        });
        this.reset()
      },
      reset(){
        this.$refs['deviceListFormData'].resetFields()
      },
      getListBySuffix() {
        this.listLoading = true;
        getDeviceListBySuffix(this.suffix).then(response => {
          if(response.data.code==0){
          this.deviceNoList=response.data.data;
          this.list=[];
          this.list.push(this.deviceNoList);
            this.listLoading = false
          }else{
            this.$message.error(response.data.msg);
            this.listLoading = false;
            return
          }

        })
      },
      handleSuffixFilter(){
        this.currentPage1=1;
        this.getListBySuffix()
      },
      getDeviceList() {
        this.listLoading = true;
        getDeviceListByEnterpriseId(this.$store.state.user.token.orgId).then(response => {
          this.list=response.data.data;
          this.currentPage1=1;
          this.listLoading = false
        })
      },
      handleSizeChange1: function(pageSize) {
        this.pageSize1 = pageSize;
        this.handleCurrentChange1(this.currentPage);
      },
      handleCurrentChange1: function(currentPage) {
        //页码切换
        this.currentPage1 = currentPage;
      }
    }
  }
</script>
