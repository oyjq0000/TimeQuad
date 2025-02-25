import React, { useState, useEffect } from 'react';
import './SettingsModal.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pomodoroMinutes: number;
  onSave: (minutes: number) => void;
  onReset: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  pomodoroMinutes,
  onSave,
  onReset
}) => {
  const [minutes, setMinutes] = useState(pomodoroMinutes);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setMinutes(pomodoroMinutes);
  }, [pomodoroMinutes]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(minutes);
    onClose();
  };

  const handleReset = () => {
    setShowConfirm(true);
  };

  const confirmReset = () => {
    onReset();
    setShowConfirm(false);
    onClose();
  };

  return (
    <div className="settings-modal-overlay">
      <div className="settings-modal">
        <h2>番茄钟设置</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group settings-row">
            <label htmlFor="pomodoroMinutes">番茄钟时长（分钟）：</label>
            <input
              type="number"
              id="pomodoroMinutes"
              min="1"
              max="60"
              value={minutes}
              onChange={(e) => setMinutes(Math.max(1, parseInt(e.target.value) || 1))}
            />
            <button type="submit" className="save-button">保存</button>
          </div>
        </form>
        <div className="reset-section">
          <hr />
          <h3>重置应用</h3>
          <p>清除所有历史记录和设置，恢复到初始状态</p>
          <button className="reset-button" onClick={handleReset}>重置应用</button>
        </div>
        <div className="modal-footer">
          <button type="button" className="cancel-button" onClick={onClose}>取消</button>
        </div>

        {showConfirm && (
          <div className="confirm-dialog">
            <div className="confirm-content">
              <h3>确认重置</h3>
              <p>此操作将清除所有任务记录和设置，且无法恢复。是否继续？</p>
              <div className="confirm-buttons">
                <button onClick={() => setShowConfirm(false)}>取消</button>
                <button onClick={confirmReset} className="danger">确认重置</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsModal;