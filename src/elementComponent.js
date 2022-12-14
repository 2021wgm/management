import Vue from 'vue'
import { Button,
         Form, 
         FormItem, 
         Input, 
         Message,
         Container,
         Header,
         Aside,
         Main,
         Menu,
         Submenu,
         MenuItem,
         Breadcrumb,
         BreadcrumbItem,
         Card,
         Col,
         Row,
         Table,
         TableColumn,
         Switch,
         Pagination,
         Tooltip,
         Dialog, 
         MessageBox,
         Tag,
         Tree,
         Select,
         Option,
         Result,
         Cascader,
         Tabs,
         TabPane,
         Alert,
         Steps,
         Step,
         Checkbox,
         CheckboxGroup,
         Upload
       } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Col)
Vue.use(Row)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Result)
Vue.use(Cascader)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Alert)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)


// Vue.use(Message)
// Vue.use(MessageBox)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
// Vue.component(Message.name,Message)