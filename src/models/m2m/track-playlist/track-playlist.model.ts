import { BaseModel } from '../../base';
import { AllowNull, BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import Track from '../../track/track.model';
import User from '../../user/user.model';
import Playlist from '../../playlist/playlist.model';

@Table({ timestamps: true, updatedAt: false, tableName: 'TracksPlaylists' })
export default class TrackPlaylist extends BaseModel<TrackPlaylist> {
    // --> ASSOCIATIONS

    // --> PLAYLIST

    /**@description playlist id*/
    @ForeignKey(() => Playlist)
    @AllowNull(false)
    @Column(DataType.UUID)
    playlistId: string;

    /**@description* playlist itself*/
    @BelongsTo(() => Playlist)
    playlist: Playlist;

    // --> TRACK

    /**@description track id*/
    @ForeignKey(() => Track)
    @AllowNull(false)
    @Column(DataType.UUID)
    trackId: string;

    /**@description* track itself*/
    @BelongsTo(() => Track)
    track: Track;

    // --> OWNER (USER)

    /**@description owner id*/
    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.UUID)
    ownerId: string;

    /**@description* owner itself*/
    @BelongsTo(() => User)
    owner: User;
}