import React, { useEffect, useMemo } from "react";

import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { Done, DoneAll } from "@mui/icons-material";

import dayjs from "dayjs";

import { storageContext } from "./contexts";
import { Button } from "@mui/material";
import { taskTypeDump } from "../utils/converts";

import TableState from "./component/tableState";
import TableGroup from "./component/tableGroup";
import TableDuration from "./component/tableDuration";

import { produce } from "immer";

interface TasksProps {
  group: string | undefined,
  sort: string | undefined,
}

interface Data {
  id: number;
  content: string;
  duration: string | undefined;
  status: "on going" | "done" | "postponed" | "canceled";
  ddl: string;
  group: string | undefined;
}

// const rows: Data[] = [
//   { id: 0, content: "todo list", status: "on going", ddl: "2021-10-01", group: undefined },
//   { id: 1, content: "todo list", status: "done", ddl: "2021-10-01", group: undefined },
//   { id: 2, content: "todo list", status: "postponed", ddl: "2021-10-01", group: undefined },
//   { id: 3, content: "todo list", status: "canceled", ddl: "2021-10-01", group: undefined },
// ]

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'content',
    numeric: false,
    disablePadding: true,
    label: '内容',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: '状态',
  },
  {
    id: 'ddl',
    numeric: false,
    disablePadding: false,
    label: '截止日期',
  },
  {
    id: 'duration',
    numeric: false,
    disablePadding: false,
    label: '持续时间',
  },
  {
    id: 'group',
    numeric: false,
    disablePadding: false,
    label: '分组',
  },
];

interface EnhancedTableProps {
  selected: number[];
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, selected, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={selected.length > 0 && selected.length < rowCount}
            checked={rowCount > 0 && selected.length === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
interface EnhancedTableToolbarProps {
  selected: number[];
  setSelect: any;
}
function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { storageValue, setStorage } = React.useContext(storageContext);
  const { selected } = props;
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        selected.length > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      {selected.length > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {selected.length} 选中
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          项目
        </Typography>
      )}
      {selected.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Tooltip title="Done">
            <IconButton onClick={() => {
              setStorage(produce((draft: any) => {
                selected.forEach((id) => {
                  let index = draft.content.tasks.findIndex((item: any) => item.id === id);
                  draft.content.tasks[index].status = "done";
                })
              }))
              props.setSelect([]);
            }}>
              <DoneAllIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="OpenInNew">
            <IconButton>
              <OpenInNewIcon />
            </IconButton>
          </Tooltip>
        </div>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}
export default function Tasks(props: TasksProps) {

  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('content');
  const [selected, setSelected] = React.useState<number[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const { storageValue, setStorage } = React.useContext(storageContext);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = storageValue.content.tasks.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - storageValue.content.tasks.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      [...storageValue.content.tasks]
        // .sort(getComparator(order, orderBy))
        // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .filter((row) => {
          if (props.group) {
            return row.group === props.group
          }
          return true
        })
        .filter((row) => {
          switch (props.sort) {
            case undefined:
              return true;
            case "today":
              return dayjs(row.ddl).isSame(dayjs(), "day");
            case "all":
              return true;
            case "incomplete":
              return row.status === "on going";
          }
        })
    ,
    [order, orderBy, page, rowsPerPage, storageValue, props.group, props.sort],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar selected={selected} setSelect={setSelected}/>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              selected={selected}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={storageValue.content.tasks.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = selected.includes(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    // onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox" onClick={(event) => handleClick(event, row.id)}>
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.content}
                    </TableCell>
                    <TableCell align="left">
                      <TableState task={row} />
                    </TableCell>
                    <TableCell align="left">
                      {row.ddl ? dayjs(row.ddl).format("MM-DD HH:mm") : ""}
                      {/* {row.ddl ? dayjs(row.ddl).format("MM-DD") : ""} */}
                    </TableCell>
                    <TableCell align="left">
                      <TableDuration task={row} />
                    </TableCell>
                    <TableCell align="left">
                      <TableGroup task={row} />
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
      </Paper>
      {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}


    </Box>
  );
}

