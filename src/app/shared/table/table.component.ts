import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SortModel } from 'src/app/core/models/sort.model';
import { AppConfigService } from 'src/app/app-config.service';
import * as appConstants from 'src/app/app.constants';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges {
  @Input() data: [];
  @Input() displayedColumns: [];
  @Input() buttonList: [];
  @Output() sort = new EventEmitter();
  tableData = [];
  columnsOfTableData = [];
  sortStatusArray: string[];
  currentRoute: string;
  lang: string;
  constructor(private router: Router ,
              private activateRoute: ActivatedRoute,
              private appConfig: AppConfigService) {}
  ngOnInit() {
    this.tableData = [...this.data];
    console.log(this.tableData);
    console.log(this.displayedColumns);
    this.sortStatusArray = [];
    this.lang = this.appConfig.getConfig().primaryLangCode;
  }

  ngOnChanges(): void {
    this.tableData = [...this.data];
    this.columnsOfTableData = [];
    this.displayedColumns.forEach(column => {
      // tslint:disable-next-line:no-string-literal
      this.columnsOfTableData.push(column['name']);
    });
  }

  selectedRow(data, index) {
    console.log(data + index);
    this.router.navigate(['404']);
  }
  getTableRowData(data, index, columnName) {
    const routeIndex = this.router.url.lastIndexOf('/');
    this.currentRoute = this.router.url.slice(0, routeIndex);
    const currentRouteType = this.router.url.split('/')[3];
    const id = appConstants.ListViewIdKeyMapping[`${currentRouteType}`];
    console.log(id);
    console.log(this.currentRoute);
    if (index === 0 && columnName === 'name' ) {
      // tslint:disable-next-line:no-string-literal
      this.router.navigate([`${this.currentRoute}/single-view`, data[id.idKey]]);
    }
  }
  sortColumn(columnName) {
    const sortModel = new SortModel();
    sortModel.sortField = columnName;
    if (this.sortStatusArray.length === 0) {
      this.sortStatusArray.push(columnName);
      sortModel.sortType = 'asc';
    } else if (this.sortStatusArray.indexOf(columnName) >= 0) {
      const valueIndex = this.sortStatusArray.indexOf(columnName);
      this.sortStatusArray.splice(valueIndex, 1);
      sortModel.sortType = 'desc';
    } else if (this.sortStatusArray.indexOf(columnName) === -1) {
      this.sortStatusArray.push(columnName);
      sortModel.sortType = 'asc';
    }
    console.log(sortModel);
    this.sort.emit(sortModel);
  }

  tableStyle(index, columnValue , columnName) {
    const myTableStyles = {
      color: '#0F2126',
      cursor: '',
      border: '',
      padding: '',
      borderRadius: '',
      backgroundColor: '',
      whiteSpace: 'nowrap'
    };
    if (index === 0) {
      myTableStyles.color = '#0F2126';
      myTableStyles.cursor = 'pointer';
      return myTableStyles;
    }
    if (columnValue === true && columnName === 'isActive') {
      myTableStyles.backgroundColor = '#C2F2DA';
      myTableStyles.padding = '5px';
      myTableStyles.border = '1px solid #4AD991';
      myTableStyles.borderRadius = '7px';
      return myTableStyles;
    } else if (columnValue === false && columnName === 'isActive') {
      myTableStyles.backgroundColor = '#CECFD0';
      myTableStyles.padding = '5px';
      myTableStyles.border = '1px solid #9C9F9F';
      myTableStyles.borderRadius = '7px';
      return myTableStyles;
    }
  }
}
