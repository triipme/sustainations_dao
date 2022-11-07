import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAsyncMemo } from "use-async-memo";
import { selectUser } from 'app/store/userSlice';
import FuseLoading from '@fuse/core/FuseLoading';
import UserAgreement from './widgets/UserAgreement';
import OverdueProject from './widgets/OverdueProject';
import OpenProject from './widgets/OpenProject';
import InvestedProject from './widgets/InvestedProject';
import GithubIssuesWidget from './widgets/GithubIssuesWidget';
import TaskDistributionWidget from './widgets/TaskDistributionWidget';
import ScheduleWidget from './widgets/ScheduleWidget';

function HomeTab() {
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(true)

  const analysis = useAsyncMemo(async () => {
    setLoading(true);
    const result = await user.actor.dashboardAnalysis();
    setLoading(false);
    console.log('result.ok', result.ok);
    return result.ok;
  }, [user]);
  const purchasedLandSlots = useAsyncMemo(async () => {
    setLoading(true);
    const result = await user.actor.purchasedLandSlotsCounter();
    setLoading(false);
    console.log('result.ok', result.ok);
    return result.ok;
  }, [user]);
  const container = {
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (<FuseLoading />);
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-24 w-full min-w-0 p-24"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <UserAgreement userAgreement={analysis.userAgreement} />
      </motion.div>
      <motion.div variants={item}>
        <OverdueProject counter={analysis.projects.overdue} objectLabel="Projects" />
      </motion.div>
      <motion.div variants={item}>
        <OpenProject counter={analysis.projects.opening} objectLabel="Projects" counterLabel="Open" />
      </motion.div>
      <motion.div variants={item}>
        <InvestedProject counter={analysis.projects.invested} objectLabel="Invested Projects" counterLabel="Projects" />
      </motion.div>
      <motion.div variants={item}>
        <OverdueProject counter={analysis.products.overdue} objectLabel="Products" />
      </motion.div>
      <motion.div variants={item}>
        <OpenProject counter={analysis.products.opening} objectLabel="Products" counterLabel="Open" />
      </motion.div>
      <motion.div variants={item}>
        <InvestedProject counter={analysis.products.invested} objectLabel="Invested Products" counterLabel="Products" />
      </motion.div>
      <motion.div variants={item}>
        <OpenProject counter={analysis.gamePlayCount.miniGamePlayCount} objectLabel="Mini Game" counterLabel="Turns" />
      </motion.div>
      <motion.div variants={item}>
        <InvestedProject counter={analysis.gamePlayCount.miniGameCompletedCount} objectLabel="Mini Game" counterLabel="Completed" />
      </motion.div>
      <motion.div variants={item}>
        <OpenProject counter={analysis.gamePlayCount.questPlayCount} objectLabel="Quest" counterLabel="Turns" />
      </motion.div>
      <motion.div variants={item}>
        <InvestedProject counter={analysis.gamePlayCount.questCompletedCount} objectLabel="Quest" counterLabel="Completed" />
      </motion.div>
      <motion.div variants={item}>
        <OpenProject counter={purchasedLandSlots} objectLabel="Land Slots" counterLabel="Purchased" />
      </motion.div>
      <motion.div variants={item} className="sm:col-span-2 md:col-span-4">
        <GithubIssuesWidget />
      </motion.div>
      <motion.div variants={item} className="sm:col-span-2 md:col-span-4 lg:col-span-2">
        <TaskDistributionWidget />
      </motion.div>
      <motion.div variants={item} className="sm:col-span-2 md:col-span-4 lg:col-span-2">
        <ScheduleWidget />
      </motion.div>
    </motion.div>
  );
}

export default HomeTab;
