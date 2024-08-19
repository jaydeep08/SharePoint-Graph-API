import * as React from 'react';
import styles from './GraphApi.module.scss';
import { IGraphApiProps } from './IGraphApiProps';
import { escape } from '@microsoft/sp-lodash-subset';
import App from '../App';

export default class GraphApi extends React.Component<IGraphApiProps, {}> {
  public render(): React.ReactElement<IGraphApiProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <section className={`${styles.graphApi} ${hasTeamsContext ? styles.teams : ''}`}>
        <App />
      </section>
    );
  }
}
