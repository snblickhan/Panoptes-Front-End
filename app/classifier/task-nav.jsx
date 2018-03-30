import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import Translate from 'react-translate-component';
import tasks from './tasks';
import CacheClassification from '../components/cache-classification';
import GridTool from './drawing-tools/grid';
import TaskNavButtons from './components/TaskNavButtons';
/* eslint-disable multiline-ternary, no-nested-ternary, react/jsx-no-bind */

class TaskNav extends React.Component {
  constructor(props) {
    super(props);
    this.addAnnotationForTask = this.addAnnotationForTask.bind(this);
    this.completeClassification = this.completeClassification.bind(this);
    this.destroyCurrentAnnotation = this.destroyCurrentAnnotation.bind(this);
  }

  componentDidUpdate() {
    const { workflow, classification } = this.props;
    classification.annotations = classification.annotations ? classification.annotations : [];
    if (classification.annotations.length === 0) {
      this.addAnnotationForTask(workflow.first_task);
    }
  }
  // Next (or first question)
  addAnnotationForTask(taskKey) {
    const { workflow, classification } = this.props;
    const taskDescription = workflow.tasks[taskKey];
    let annotation = tasks[taskDescription.type].getDefaultAnnotation(taskDescription, workflow, tasks);
    annotation.task = taskKey;

    if (workflow.configuration.persist_annotations) {
      const cachedAnnotation = CacheClassification.isAnnotationCached(taskKey);
      if (cachedAnnotation) {
        annotation = cachedAnnotation;
      }
    }

    const annotations = classification.annotations.slice();
    annotations.push(annotation);
    this.props.updateAnnotations(annotations);
    this.props.onNextTask(taskKey);
  }

  // Done
  completeClassification(e) {
    const { workflow, classification } = this.props;
    if (workflow.configuration.persist_annotations) {
      CacheClassification.delete();
    }

    const currentAnnotation = classification.annotations[classification.annotations.length - 1];
    const currentTask = workflow.tasks[currentAnnotation.task];

    if (currentTask && currentTask.tools) {
      currentTask.tools.map((tool) => {
        if (tool.type === 'grid') {
          GridTool.mapCells(classification.annotations);
        }
      });
    }

    if (currentAnnotation.shortcut) {
      this.addAnnotationForTask(currentTask.unlinkedTask);
      const newAnnotation = classification.annotations[classification.annotations.length - 1];
      newAnnotation.value = currentAnnotation.shortcut.value;
      delete currentAnnotation.shortcut;
    }
    this.props.completeClassification(e);
  }

  // Back
  destroyCurrentAnnotation() {
    const { workflow, classification } = this.props;
    const lastAnnotation = classification.annotations[classification.annotations.length - 1];

    const annotations = classification.annotations.slice();
    annotations.pop();
    this.props.updateAnnotations(annotations);
    this.props.onPrevTask();

    if (workflow.configuration.persist_annotations) {
      CacheClassification.update(lastAnnotation);
    }
  }

  render() {
    const completed = !!this.props.classification.completed;

    const task = this.props.task ? this.props.task : this.props.workflow.tasks[this.props.workflow.first_task];

    const disableTalk = this.props.classification.metadata.subject_flagged;
    const visibleTasks = Object.keys(this.props.workflow.tasks).filter(key => this.props.workflow.tasks[key].type !== 'shortcut');
    const TaskComponent = tasks[task.type];

    // Should we disable the "Back" button?
    // const onFirstAnnotation = !completed && (this.props.classification.annotations.indexOf(this.props.annotation) === 0);

    // Should we disable the "Next" or "Done" buttons?
    let waitingForAnswer = this.props.disabled;
    if (TaskComponent && TaskComponent.isAnnotationComplete && this.props.annotation) {
      waitingForAnswer = !this.props.annotation.shortcut && !TaskComponent.isAnnotationComplete(task, this.props.annotation, this.props.workflow);
    }

    // Each answer of a single-answer task can have its own `next` key to override the task's.
    let nextTaskKey = '';
    if (TaskComponent === tasks.single && this.props.annotation) {
      const currentAnswer = task.answers[this.props.annotation.value];
      nextTaskKey = currentAnswer ? currentAnswer.next : '';
    } else {
      nextTaskKey = task.next;
    }

    if (nextTaskKey && !this.props.workflow.tasks[nextTaskKey]) {
      nextTaskKey = '';
    }

    const showDoneAndTalkLink = !nextTaskKey &&
      this.props.workflow.configuration.hide_classification_summaries &&
      this.props.project &&
      !disableTalk &&
      !completed;

    return (
      <div>
        <nav className="task-nav">
          <TaskNavButtons
            addAnnotationForTask={this.addAnnotationForTask.bind(this, nextTaskKey)}
            areAnnotationsNotPersisted={!this.props.workflow.configuration.persist_annotations}
            autoFocus={this.props.autoFocus}
            classification={this.props.classification}
            completeClassification={this.completeClassification}
            completed={completed}
            demoMode={this.props.demoMode}
            destroyCurrentAnnotation={this.destroyCurrentAnnotation}
            nextSubject={this.props.nextSubject}
            project={this.props.project}
            showBackButton={visibleTasks.length > 1 && !completed && (this.props.classification.annotations.indexOf(this.props.annotation) !== 0)}            
            showNextButton={!!(nextTaskKey && this.props.annotation && !this.props.annotation.shortcut)}
            showDoneAndTalkLink={showDoneAndTalkLink}
            subject={this.props.subject}
            waitingForAnswer={waitingForAnswer}
          />
          {this.props.children}
        </nav>
      </div>
    );
  }
}

TaskNav.propTypes = {
  annotation: PropTypes.shape({
    shortcut: PropTypes.object,
    value: PropTypes.any
  }),
  autoFocus: PropTypes.bool,
  children: PropTypes.node,
  classification: PropTypes.shape({
    annotations: PropTypes.array,
    completed: PropTypes.bool,
    gold_standard: PropTypes.bool,
    id: PropTypes.string,
    metadata: PropTypes.object
  }),
  completeClassification: PropTypes.func,
  disabled: PropTypes.bool,
  nextSubject: PropTypes.func,
  demoMode: PropTypes.bool,
  project: PropTypes.shape({
    id: PropTypes.string,
    slug: PropTypes.string
  }),
  subject: PropTypes.shape({
    id: PropTypes.string
  }),
  task: PropTypes.shape({
    type: PropTypes.string
  }),
  updateAnnotations: PropTypes.func,
  workflow: PropTypes.shape({
    id: PropTypes.string,
    configuration: PropTypes.object,
    first_task: PropTypes.string,
    tasks: PropTypes.object
  })
};

TaskNav.defaultProps = {
  autoFocus: true,
  disabled: false,
  updateAnnotations: () => null
};

export default TaskNav;
