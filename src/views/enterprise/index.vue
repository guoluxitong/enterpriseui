<template>
  <div>
    <div v-if="enterprisecodevisible===1">
      <el-table
        :data="customerList.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)"
        v-loading="listLoading"
        element-loading-text="给我一点时间"
        border
        fit
        highlight-current-row
        style="width: 120%"
      >
        <el-table-column :show-overflow-tooltip="true" align="left" label="客户名称">
          <template slot-scope="scope">
            <span>{{scope.row.customerName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="getCustomerCodes(scope.row)"
            >客户编号列表</el-button>
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
          :total="customerList.length"
        ></el-pagination>
      </div>
    </div>
    <div v-if="enterprisecodevisible===2">
      <el-row style="margin-left: 10px;margin-top: 10px" class="app-query">
        <el-col :offset="22" :span="2">
          <el-button @click="handleCodeCancel" icon="el-icon-back" type="warning">取消</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="customerCodeList.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)"
        v-loading="listLoading"
        element-loading-text="给我一点时间"
        border
        fit
        highlight-current-row
        style="width: 120%"
      >
        <el-table-column :show-overflow-tooltip="true" align="left" label="客户名称">
          <template slot-scope="scope">
            <span>{{scope.row.customerName}}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="left" label="编号">
          <template slot-scope="scope">
            <span>{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="left" label="是否可用">
          <template slot-scope="scope">
            <span v-if="1==scope.row.status">是</span>
            <span v-else>否</span>
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
          :total="customerCodeList.length"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { getCustomerlist, getCustomerPrefixList } from "@/api/enterprise";
export default {
  data() {
    return {
      list: [],
      customerList: [],
      customerCodeList: [],
      currentPage1: 1,
      pageNum1: 1,
      pageSize1: 5,
      enterpriseName: "",
      listQuery2: {
        total: 50,
        pageNum: 1,
        pageSize: 5,
        enterpriseCustomerId: "",
        code: "",
        codePrefix: ""
      },
      enterprisecodevisible: 1,
      listLoading: true
    };
  },
  created() {
    this.getCustomerList();
  },
  methods: {
    getCustomerList() {
      getCustomerlist(this.$store.state.user.token.orgId).then(response => {
        if (response.data.code == 0) {
          this.customerList = response.data.data;
          this.listLoading = false;
        } else {
          this.$message.error(response.data.msg);
          return;
        }
      });
    },
    getCustomerCodes(row) {
      this.currentPage1 = 1;
      this.enterprisecodevisible = 2;
      this.listQuery2.enterpriseCustomerId = row.id;
      this.listLoading = true;
      getCustomerPrefixList(this.listQuery2.enterpriseCustomerId).then(
        response => {
          if (response.data.code == 0) {
            this.customerCodeList = response.data.data;
            this.listLoading = false;
          } else {
            this.$message.error(response.data.msg);
            return;
          }
        }
      );
    },
    handleCodeCancel() {
      this.currentPage1 = 1;
      this.enterprisecodevisible = 1;
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
};
</script>
