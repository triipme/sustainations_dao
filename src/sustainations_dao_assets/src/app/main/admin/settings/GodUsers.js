import { v4 as uuidv4 } from 'uuid';
import {
    Button,
    TextField,
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Controller, useFormContext } from 'react-hook-form';
import { useEffect, useState } from 'react';
import _ from 'lodash';


function GodUsers() {
    const methods = useFormContext();
    const { control: control1, formState: formState1, watch: watch1, setValue: setValue1 } = methods;
    const { errors } = formState1;

    const godUsers = watch1('godUsers');


    const addGodUsers = () => {
        const item = {
            ID: uuidv4(),
            godUserID: "",
            deleted1: false,
        }
        setValue1('godUsers', _.concat(godUsers, item));
    };
    const onRemoveGodUserID = (ID) => {
        const list = godUsers.map(item => {
            try {
                if (item.ID == ID) {
                    return _.merge(item, { deleted1: true });
                } else {
                    return item;
                }
            } catch {
                console.log("undefine")
            }
        });
        if (_.findIndex(list, { deleted1: false }) == -1) {
            return;
        }
        setValue1('godUsers', list);
    }
    return (
        <div>
            {godUsers && godUsers.map((item, itemIndex) => (
                item != undefined && !item.deleted1 &&
                <div className={`flex -mx-4 ${item.deleted1}`}>
                    <Controller
                        name={`godUsers[${itemIndex}][godUserID]`}
                        control={control1}
                        render={({ field }) => (
                            <TextField
                                sx={{ m: 1, minWidth: 120 }}
                                {...field}
                                error={!!errors.godUsers?.[itemIndex]?.godUserID}
                                required
                                helperText={errors?.godUsers?.[itemIndex]?.godUserID?.message}
                                className="mt-8 mb-16 mx-4"
                                label="God User"
                                type="text"
                                variant="outlined"
                                size="medium"
                                fullWidth
                            />
                        )}
                    />
                    <Button
                        className="px-16"
                        color="warning"
                        variant="contained"
                        startIcon={
                            <FuseSvgIcon className="" size={20}>
                                remove
                            </FuseSvgIcon>
                        }
                        onClick={() => { onRemoveGodUserID(item.ID) }}
                    >
                    </Button>
                </div>


            ))}
            <Button
                className="px-16 min-w-128"
                color="secondary"
                variant="contained"
                startIcon={
                    <FuseSvgIcon className="" size={20}>
                        add
                    </FuseSvgIcon>
                }
                onClick={() => { addGodUsers() }}
            >
                Add God User
            </Button>

        </div>


    );
}

export default GodUsers;
