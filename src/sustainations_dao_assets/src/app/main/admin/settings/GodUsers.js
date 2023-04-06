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
    const { control: controlGodUser, formState: formStateGodUser, watch: watchGodUser, setValue: setValueGodUser } = methods;
    const { errors } = formStateGodUser;

    const godUsers = watchGodUser('godUsers');


    const addGodUsers = () => {
        const item = {
            ID: uuidv4(),
            godUserID: "",
            deletedGodUser: false,
        }
        setValueGodUser('godUsers', _.concat(godUsers, item));
    };
    const onRemoveGodUserID = (ID) => {
        const list = godUsers.map(item => {
            try {
                if (item.ID == ID) {
                    return _.merge(item, { deletedGodUser: true });
                } else {
                    return item;
                }
            } catch {
                console.log("undefine")
            }
        });
        setValueGodUser('godUsers', list);
        if (_.findIndex(list, { deletedGodUser: false }) == -1) {
            return;
        }
    }
    return (
        <div>
            {godUsers && godUsers.map((item, itemIndex) => (
                item != undefined && !item.deletedGodUser &&
                <div className={`flex -mx-4 ${item.deletedGodUser}`}>
                    <Controller
                        name={`godUsers[${itemIndex}][godUserID]`}
                        control={controlGodUser}
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
