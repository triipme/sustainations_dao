import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Stack, Box, Typography, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import { Controller, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { useLocation, useNavigate } from "react-router-dom";

const Context = createContext();
const MemoryCardEngine = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (!state) {
      navigate(-1);
    }
  }, []);
  return (
    <Box>
      <Context.Provider value={state}>
        <TopOfYesterday />
        <ListOfDay />
        <ListAll />
      </Context.Provider>
    </Box>
  );
};
const ListAll = () => {
  const [list, setList] = useState();
  const state = useContext(Context);
  const { actor } = useSelector(state => state.user);
  async function initialEffect() {
    try {
      if (!!actor?.memoryCardEngineListAll) {
        const rs_list = await actor.memoryCardEngineListAll(state);
        if ("ok" in rs_list) setList(rs_list.ok);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    initialEffect();
  }, []);
  const rows = useMemo(() => {
    return list?.map((l, l_i) => {
      const col2 = totalTurn(l?.history);
      const col3 = totalTime(l?.history);
      return {
        id: l_i,
        col1: String(l?.aId),
        col2,
        col3,
        col4: col2 + col3,
        col5: l?.history?.length,
        col6: moment.unix(parseInt(l.createdAt / BigInt(1e9))).format("L"),
        col7: moment.unix(parseInt(l.updatedAt / BigInt(1e9))).format("LLL")
      };
    });
  }, [list]);
  const columns = useMemo(
    () => [
      { field: "col1", headerName: "Name", width: 500 },
      { field: "col2", headerName: "Total turn" },
      { field: "col3", headerName: "Total time(s)" },
      { field: "col4" },
      { field: "col5", headerName: "Stages", width: 200 },
      { field: "col6", headerName: "CreatedAt", width: 200 },
      { field: "col7", headerName: "UpdatedAt", width: 200 }
    ],
    []
  );

  return (
    <Box width="100%">
      <Typography variant="h3" align="center">
        Player List
      </Typography>
      <DataGrid
        rows={rows ?? []}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        pagination
        autoHeight
        disableColumnMenu
        initialState={{
          columns: {
            columnVisibilityModel: {
              col4: false
            }
          },
          sorting: {
            sortModel: [{ field: "col4", sort: "asc" }]
          }
        }}
      />
    </Box>
  );
};
const ListOfDay = () => {
  const [list, setList] = useState();
  const state = useContext(Context);
  const { actor } = useSelector(state => state.user);
  async function initialEffect() {
    try {
      if (!!actor?.memoryCardEngineListOfDay) {
        const rs_list = await actor.memoryCardEngineListOfDay(state);
        if ("ok" in rs_list) setList(rs_list.ok);
      }
    } catch (error) {
      console.log(error);
    }
  }
  console.log(list);
  useEffect(() => {
    initialEffect();
  }, []);
  const rows = useMemo(() => {
    return list?.map((l, l_i) => {
      const col2 = totalTurn(l[0].history);
      const col3 = totalTime(l[0].history);
      return {
        col1: String(l[0].aId),
        col2,
        col3,
        col4: col2 + col3
      };
    });
  }, [list]);
  const max = useMemo(() => {
    if (rows?.length > 1) {
      return rows?.reduce((a, b) => {
        return a?.col4 < b?.col4 ?? 10e9 ? a : b;
      });
    } else {
      return rows?.[0];
    }
  }, [rows]);
  const columns = useMemo(
    () => [
      { field: "col1", headerName: "Name", width: 500, sortable: false },
      { field: "col2", headerName: "Total turn", sortable: false },
      { field: "col3", headerName: "Total time(s)", sortable: false },
      { field: "col4" }
    ],
    []
  );

  return (
    <Box>
      <Typography variant="h3" align="center">
        Top of Today
      </Typography>
      <Box width="100%">
        <DataGrid
          getRowId={row => row.col1}
          rows={rows ?? []}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          pagination
          autoHeight
          disableColumnMenu
          initialState={{
            columns: {
              columnVisibilityModel: {
                col4: false
              }
            },
            sorting: {
              sortModel: [{ field: "col4", sort: "asc" }]
            }
          }}
        />
      </Box>
    </Box>
  );
};
const TopOfYesterday = () => {
  const { actor } = useSelector(state => state.user);
  const [top, setTop] = useState();
  const state = useContext(Context);
  const [disableReward, setDisableReward] = useState(true);
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm();
  async function initialTopOne() {
    try {
      if (!!actor?.memoryCardEngineListOfYesterday) {
        const rs_list = await actor.memoryCardEngineListOfYesterday(state);
        if ("ok" in rs_list) {
          setTop(topOne(rs_list.ok));
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function checkReward(id) {
    try {
      if (!!actor?.memoryCardEngineCheckReward) {
        const rs = await actor.memoryCardEngineCheckReward(id);
        if ("ok" in rs) {
          console.log("check", rs.ok);
          setDisableReward(!!rs.ok[0]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    initialTopOne();
  }, []);
  useEffect(() => {
    if (!!top) {
      checkReward(top?.[0]);
    }
  }, [top]);
  const handleReward = async data => {
    try {
      if (!!actor?.memoryCardEngineReward) {
        setLoading(true);
        const rs_reward = await actor.memoryCardEngineReward(top?.[0], +data.reward, top?.[1]?.uid);
        if ("ok" in rs_reward) {
          setDisableReward(true);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box>
      <Typography variant="h3" align="center">
        Top of Yesterday
      </Typography>
      <Typography variant="h5" align="center">
        {String(top?.[1]?.uid ?? "No one")}
      </Typography>
      <Typography variant="h4" align="center">
        total turn {totalTurn(top?.[1]?.history) ?? 0}
      </Typography>
      <Typography variant="h4" align="center">
        total time {totalTime(top?.[1]?.history) ?? 0}
      </Typography>
      <Stack
        width="10em"
        alignItems="center"
        justifyContent="center"
        direction="row"
        mx="auto"
        my={3}>
        {!!!disableReward && (
          <>
            <Controller
              control={control}
              label="Reward"
              name="reward"
              render={({ field }) => <TextField label="Reward" {...field} />}
            />
            {/* <InputText control={control} label="Reward" name="reward" helperTextError={ERRORS} /> */}
            <LoadingButton
              loading={loading}
              sx={{ width: 100, ml: 1 }}
              onClick={handleSubmit(handleReward)}>
              Reward
            </LoadingButton>
          </>
        )}
      </Stack>
    </Box>
  );
};

function topOne(list) {
  return list.sort(compare)[0][0];
}

function compare(a, b) {
  const score = array => {
    const sum_turn = totalTurn(array);
    const sum_time = totalTime(array);
    return sum_turn + sum_time;
  };
  if (score(a[0][0][1].history) < score(b[0][0][1].history)) {
    return -1;
  } else if (score(a[0][0][1].history) > score(b[0][0][1].history)) {
    return 1;
  } else {
    return 0;
  }
}

function totalTurn(array) {
  return array?.reduce((a, b) => parseInt(a) + parseInt(b?.turn), 0n);
}

function totalTime(array) {
  return array?.reduce((a, b) => a + b?.timing, 0);
}

export default MemoryCardEngine;
