import React from "react";
import { Button, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList } from "@mui/material";

import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';


import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';

import dayjs from "dayjs";
import updateLocale from 'dayjs/plugin/updateLocale';
import duration from "dayjs/plugin/duration";
import { setPriority } from "os";
import "dayjs/locale/zh-cn";

dayjs.extend(duration);
dayjs.extend(updateLocale)
dayjs.locale("zh-cn")
// dayjs.locale("zh-cn", { weekStart: 1, });
dayjs.updateLocale("zh-cn", { weekStart: 2, });


interface Props {
  date: any,
  setDate: any,
}

export default function DateInput({ date, setDate }: Props) {

  const [datePickerLevel, setDatePickerLevel] = React.useState(0)
  const [datePickerAnchor, setDatePickerAnchor] = React.useState<HTMLElement | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = React.useState<Date | null>(null);

  return <>
    {date ?
      <Button startIcon={<CalendarMonthIcon fontSize="small" />} onClick={(e) => { setDatePickerAnchor(e.currentTarget); setDatePickerLevel(1); }}>
        {dayjs(date).format("MM-DD HH:mm")}
      </Button>
      :
      <IconButton onClick={(e) => {
        setDatePickerAnchor(e.currentTarget);
        setDatePickerLevel(1)
      }}>
        <CalendarMonthIcon fontSize="small" />
      </IconButton>
    }

    <Menu anchorEl={datePickerAnchor} open={datePickerLevel !== 0} onClose={() => { setDatePickerLevel(0); }}>
      {
        datePickerLevel === 1 &&
        <MenuList sx={{ width: "150px" }} disablePadding>
          <MenuItem onClick={() => {
            setDatePickerLevel(0);
            setDate(dayjs().endOf('day').endOf('hour').endOf('minute'));
          }}>
            <ListItemText primary="今天" secondary={dayjs().format("MM-DD") + " 周" + "日一二三四五六".charAt(dayjs().day())} />
          </MenuItem>
          <MenuItem onClick={() => {
            setDatePickerLevel(0);
            setDate(dayjs().add(1, "day").endOf('day').endOf('hour').endOf('minute'));
          }}>
            <ListItemText primary="明天" secondary={dayjs().add(1, "day").format("MM-DD") + " 周" + "日一二三四五六".charAt(dayjs().add(1, "day").day())} />
          </MenuItem>
          {/* <MenuItem onClick={() => {
            setDatePickerLevel(0);
            setDate(dayjs().endOf("week").endOf('hour').endOf('minute'));
          }}>
            <ListItemText primary="这周" secondary={dayjs().endOf("week").format("MM-DD") + " 周" + "日一二三四五六".charAt(dayjs().endOf("week").day())} />
          </MenuItem> */}
          <MenuItem onClick={() => {
            setDatePickerLevel(0);
            // setDate(dayjs().endOf("week").endOf('hour').endOf('minute'));
            setDate(dayjs().add(7 - (((dayjs().day() + 6) % 7) + 1), "day").endOf('day').endOf('hour').endOf('minute'));
          }}>
            <ListItemText primary="这周" secondary={dayjs().add(7 - ((dayjs().day() + 6) % 7 + 1), "day").format("MM-DD") + " 周" + "日一二三四五六".charAt(dayjs().add(7 - ((dayjs().day() + 6) % 7 + 1), "day").day())} />
          </MenuItem>
          <MenuItem onClick={() => { setDatePickerLevel(2); }}>
            <ListItemText primary="选择" />
            <ListItemIcon>
              <NavigateNextRoundedIcon fontSize="small" />
            </ListItemIcon>
          </MenuItem>
          <MenuItem onClick={() => {
            setDatePickerLevel(0);
            setDate(null);
          }}>
            <ListItemText primary="清除" sx={{ color: "error" }}></ListItemText>
          </MenuItem>
        </MenuList>
      }
      {
        datePickerLevel === 2 &&
        <>
          <DateCalendar defaultValue={dayjs().endOf("hour").endOf("minute")} onChange={(val) => setSelectedDate(val)} />
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
            <Button onClick={() => { setDatePickerLevel(3); }}>进一步</Button>
            <Button onClick={() => { setDatePickerLevel(0); setDate(selectedDate) }}>确定</Button>
          </div>
        </>
      }
      {
        datePickerLevel === 3 &&
        <>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-end" }}>
            <MultiSectionDigitalClock value={selectedTime ? dayjs(selectedTime) : dayjs()} onChange={(val) => { setSelectedTime(val.toDate()); }} />
            <Button onClick={() => { setDatePickerLevel(2); }}>返回</Button>
            <Button onClick={() => { setDatePickerLevel(0);
              setDate(dayjs(selectedDate).set("hour", dayjs(selectedTime).hour()).set("minute", dayjs(selectedTime).minute()).toDate());
             }}>确认</Button>
          </div>
        </>
      }
    </Menu>
  </>
}
